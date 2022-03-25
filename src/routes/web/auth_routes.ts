import { Router, Request, Response } from 'express'

const router = Router();

router.get('/login', (req: Request, res: Response) => {
    res.render("login")
});

router.post('/login', (req: Request, res: Response) => {
    console.log(req.body)
    res.render("login")
});

router.get('/register', (req: Request, res: Response) => {
    res.render("register")
});

router.post('/register', (req: Request, res: Response) => {
    console.log(req.body)
    res.render("login")
});

export default router;
