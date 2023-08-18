import { Modal, useMantineTheme } from "@mantine/core";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { uploadImage } from "../../actions/uploadAction";
import { updateUser } from "../../actions/UserAction";

function ProfileModal({ modalOpened, setModalOpened, data }) {
    const theme = useMantineTheme();

    const { password, ...other } = data;
    const [formData, setFormData] = useState(other);

    const [profileImage, setProfileImage] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const dispatch = useDispatch();
    const params = useParams();
    const { user } = useSelector((state) => state.authReducer.authData);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const onImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            let img = e.target.files[0]
            e.target.name === "profileImage"
                ? setProfileImage(img)
                : setCoverImage(img)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let UserData = formData;
        if (profileImage) {
            const data = new FormData();
            const filename = Date.now() + profileImage.name;
            data.append("name", filename);
            data.append("file", profileImage);
            UserData.profilePicture = filename;

            try {
                dispatch(uploadImage(data))
            } catch (error) {
                console.log(error)
            }
        }
        if (coverImage) {
            const data = new FormData();
            const fileName = Date.now() + coverImage.name;
            data.append("name", fileName);
            data.append("file", coverImage);
            UserData.coverPicture = fileName;
            try {
                dispatch(uploadImage(data));
            } catch (err) {
                console.log(err);
            }
        }

        dispatch(updateUser(params.id, UserData));
        setModalOpened(false)
    }

    return (
        <Modal
            overlayColor={
                theme.colorScheme === "dark"
                    ? theme.colors.dark[9]
                    : theme.colors.gray[2]
            }
            overlayOpacity={0.55}
            overlayBlur={3}
            size="55%"
            opened={modalOpened}
            onClose={() => setModalOpened(false)}
        >
            <form className="infoForm">
                <h3>Your info</h3>

                <div>
                    <input
                        type="text"
                        className="infoInput"
                        name="firstname"
                        value={formData.firstname}
                        placeholder="First Name"
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        className="infoInput"
                        name="lastname"
                        value={formData.lastname}
                        placeholder="Last Name"
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <input
                        type="text"
                        className="infoInput"
                        name="worksAt"
                        value={formData.worksAt}
                        placeholder="Works at"
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <input
                        type="text"
                        className="infoInput"
                        name="livesin"
                        value={formData.livesin}
                        placeholder="LIves in"
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        className="infoInput"
                        name="country"
                        value={formData.country}
                        placeholder="Country"
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <input
                        type="text"
                        className="infoInput"
                        name="relationship"
                        value={formData.relationship}
                        placeholder="RelationShip Status"
                        onChange={handleChange}
                    />
                </div>


                <div>
                    Profile Image
                    <input type="file" name='profileImage' onChange={onImageChange} />
                    Cover Image
                    <input type="file" name="coverImage" onChange={onImageChange} />
                </div>

                <button className="button infoButton" onClick={handleSubmit}>Update</button>
            </form>
        </Modal>
    );
}

export default ProfileModal;