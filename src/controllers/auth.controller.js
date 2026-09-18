const {registerUser, loginUser} = require("../services/auth.service")

module.exports = {
  //register controllerx
    registerUserController : async(req, res, next) => {
        try{
            const data = req.body

            const result = await registerUser(data)

            return res.status(result.status).json({
                message: result.message,
                user: result.user

            })
        }
        catch(error){
            console.log("Error is ", error)
            return next(error)
        }
    },



    //login controller
    loginUserController: async (req, res, next) => {
            try {

                console.log("REQ BODY:", req.body)
                const data = req.body
                const result = await loginUser(data)

                return res.status(result.status).json({
                    message: result.message,
                    token: result.token,
                    user: result.user
                })
            }
            catch (error) {
                return next(error)
            }

        },



        // Logout controller
    logoutUserController: async (req, res, next) => {
        try {
            return res.status(200).json({
                message: "Logout successful"
            })

        } catch (error) {
            console.error("Logout controller error:", error)
            return next(error)
        }
    }
}
