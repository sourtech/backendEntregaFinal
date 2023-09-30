import TimeAgo from 'javascript-time-ago'
import es from 'javascript-time-ago/locale/es'

TimeAgo.addDefaultLocale(es);
const timeAgo = new TimeAgo('es-ES')
export default class userDTO {
    constructor(user) {
        this.id=user._id,
        this.name=`${user.first_name} ${user.last_name}`,
        this.email=user.email,
        this.image=user.image,
        this.role=user.role,
        this.cart=user.cart,
        this.created_at= user.created_at ? user.created_at.toLocaleDateString() : '',
        this.last_connection= user.last_connection ? timeAgo.format(user.last_connection) : '-',
        this.superUser=(user.role==='admin' || user.role==='premium' ? true : false)
    }
}