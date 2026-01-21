import { Router } from "express";
import { isLoggedIn, checkAdmin } from "../middlewares/auth.middleware.js";
import {
  createModule,
  deleteModule,
  getAllModules,
  getModuleById,
  getModuleProgress,
  getModuleStats,
  updateModule,
} from "../controllers/modules.controllers.js";

const router = Router();

//Public routes
router.route("/getAll/:courseId").get(isLoggedIn, getAllModules);

router.route("/getModule/:id").get(isLoggedIn, getModuleById);

router.route("/getModuleProgress/:id").get(isLoggedIn, getModuleProgress);

//Instructor and admin routes
router.route("/create").post(isLoggedIn, checkAdmin, createModule);

router.route("/update/:id").patch(isLoggedIn, checkAdmin, updateModule);

router.route("/delete/:id").delete(isLoggedIn, checkAdmin, deleteModule);

router.route("/getModuleStats/:id").get(isLoggedIn, checkAdmin, getModuleStats);

export default router;
