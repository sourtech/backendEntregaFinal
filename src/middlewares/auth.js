export const privacy = (privacyType) => {
    return (req, res, next) => {
        const { user } = req;
        
        switch (privacyType) {
            case "PRIVATE":
                if(user) next();
                else res.redirect('/login');
                break;
            case "NO_AUTHENTICATED":
                if(!user) next();
                else res.redirect('/profile');
                break;
        }
    };
  };
  
  export const authRoles = (role) => {
    //Si llegué a este punto, SIEMPRE debo tener un usuario ya. 
    return async (req, res, next) => {
      if (req.user.role != role) return res.status(403).send({ status: "error", error: "Fobidden" })
      next();
    }
  }