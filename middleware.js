function authMiddleware(req, res, next) {
    if (req.originalUrl === '/login' || req.originalUrl === '/register' || req.originalUrl === '/') {
        if (req.session.user) {
            if (req.session.user.role === 'admin') {
            return res.redirect('/admin');
            } else {
                return res.redirect('/user');
            }
        }
        else{
            if (req.originalUrl === '/'){
                return res.redirect('/login');
            }else{
                next();
            }
        }
    }
    else{
    
        if (req.session.user) {
            next();
        }
        else{
            return res.redirect('/login');
        }
    
    }
    
    }
    
    export { authMiddleware };