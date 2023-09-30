export default class forgotDTO {
    static getFrom = user => {
        return {
            email:user.email
        }
    }
}