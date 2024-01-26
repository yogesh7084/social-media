import * as AuthApi from '../api/AuthRequest'

export const login = (formData) => async (dispatch) => {

    dispatch({ type: "AUTH_START" })
    try {
        const { data } = await AuthApi.login(formData)
        dispatch({ type: "AUTH_SUCCESS", data: data })
        return "Login Successful";
    } catch (error) {
        console.log(error.response.data.message);
        dispatch({ type: "AUTH_FAIL" })
        return error.response.data.message;
    }
}
export const signUp = (formData) => async (dispatch) => {

    dispatch({ type: "AUTH_START" })
    try {
        const { data } = await AuthApi.signUp(formData)
        dispatch({ type: "AUTH_SUCCESS", data: data })
        return "Signup Successful";
    } catch (error) {
        console.log(error);
        dispatch({ type: "AUTH_FAIL" })
        return error.response.data.message;
    }
}

export const logout = () => async (dispatch) => {
    dispatch({ type: "LOGOUT" })
}