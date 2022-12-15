import React from 'react'
import styles from "./userCard.module.css";
import profilePic from "../../Logo/profile.png"
import { userUpdateAuth0} from '../../redux/actions'
import { useAuth0 } from '@auth0/auth0-react'
import { useDispatch, useSelector } from 'react-redux'


const UserCard = ({email, id, image, isActive, isAdmin, createdAt, sub}) => {

    const { getAccessTokenSilently } = useAuth0()
    const dispatch = useDispatch()
    const userLogin = useSelector((state) => state.userLogin)


    const formatDate = (dateString) => {
        let onlyDate = dateString.split('T')[0].split('-')
        let day = (onlyDate[2])
        let month = (onlyDate[1])
        let year = (onlyDate[0])
        let formattedDate = day + "/" + month + "/" + year
        return formattedDate;
    }

    const getToken = async () => {
        const token = await getAccessTokenSilently();
        return `${token}`;
    };

    const deactivateUser = async (e) => {
        e.preventDefault(e)
        if (userLogin.sub !== sub && isActive === true) {
        dispatch(userUpdateAuth0(null, sub, 'block', getToken))
        }
        if (userLogin.sub !== sub && isActive === false) {
          dispatch(userUpdateAuth0(null, sub, 'unblock', getToken))
          }
        alert('Los cambios se verán reflejados luego de actualizar la página')
        setTimeout(() => {
          window.location.reload()
        }, 4000);
    }

    const makeAdmin = async (e) => {
        e.preventDefault(e)
        console.log('función makeAdmin', isAdmin, sub, getToken);
        if ((isAdmin === true) && (userLogin.sub !== sub)) {
            console.log('entró al IF', isAdmin, sub, getToken);
            dispatch(userUpdateAuth0(null, sub, 'removeAdmin', getToken))
        } 
        if ((isAdmin === false) && (userLogin.sub !== sub)) {
            console.log('entró al IF', isAdmin, sub, getToken);
            dispatch(userUpdateAuth0(null, sub, 'makeAdmin', getToken))
        }
        alert('Los cambios se verán reflejados luego de actualizar la página')
        setTimeout(() => {
          window.location.reload()
        }, 4000);
    }

    return (
      <div className={styles.userCardContainer}>
        <div className={styles.userCardImage}>
          {image.url ? (
            <img src={image.url} />
          ) : (
            <img src={profilePic} />
          )}
        </div>

        <div className={styles.userCardEmail}>
          <p>{email}</p>
        </div>

        <div className={styles.userCardId}>
          <p>ID: {id}</p>
        </div>

        <div className={styles.userCardCreatedAt}>
          <p>{formatDate(createdAt)}</p>
        </div>

        <div className={styles.userCardIsActive}>
          <input
            id="isActive"
            onChange={(e) => deactivateUser(e)}
            checked={isActive}
            type="checkbox"
          />
        </div>

        {userLogin?.role === "superAdmin" ? (
          <div className={styles.userCardIsAdmin}>
            {isAdmin ? (
              <input
                id="isAdmin"
                checked
                onChange={(e) => makeAdmin(e)}
                type="checkbox"
              />
            ) : (
              <input
                name="isAdmin"
                onChange={(e) => makeAdmin(e)}
                type="checkbox"
              />
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    );
}

export default UserCard;
