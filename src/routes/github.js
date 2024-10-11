import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/', passport.authenticate('github', { scope: ['user:email'] }), (req, res) => {
    res.send({ status: 'success', message: 'success' });
});

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/', session: false  }), (req, res) => {
    if (req.user && req.user.token) {
       
        res.cookie('cookieRojo', req.user.token, { maxAge: 60 * 60 * 1000, httpOnly: true }).redirect('https://edgar-steinberg-portfolio.netlify.app/proyects');
     
    } else {
        res.redirect('/')
    }
});

export default router;