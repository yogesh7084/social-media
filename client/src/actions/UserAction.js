import * as UserApi from "../api/UserRequest";


export const updateUser = (id, formData) => async (dispatch) => {
    dispatch({ type: "UPDATING_START" })
    try {
        const { data } = await UserApi.updateUser(id, formData);
        dispatch({ type: "UPDATING_SUCCESS", data: data })
    }
    catch (error) {
        dispatch({ type: "UPDATING_FAIL" })
    }
}

export const followUser = (id, data) => async (dispatch) => {
    UserApi.followUser(id, data);
    dispatch({ type: "FOLLOW_USER", data: id })
}
export const unFollowUser = (id, data) => async (dispatch) => {
    UserApi.unFollowUser(id, data);
    dispatch({ type: "UNFOLLOW_USER", data: id })
}