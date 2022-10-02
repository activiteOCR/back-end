import express from "express";
import controller from '../controllers/giveaway.controller'

const router = express.Router()

router.get('/disc/:username', controller.verifyDiscordUSer);
router.get('/twit/:username', controller.verifyTwitterUSer);
router.post('/participate', controller.participate)

export = router