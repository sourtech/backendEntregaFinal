export default class userDTO {
    constructor(user) {
        this.name=`${user.first_name} ${user.last_name}`,
        this.email=user.email,
        this.role=user.role
    }
}