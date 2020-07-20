import { Router } from "https://deno.land/x/oak/mod.ts";
import {
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    addProduct,
} from "./controllers/products.ts";
import {
    addMeta,
    deleteMeta,
    getMeta,
    getSingleMeta,
    updateMeta
} from './controllers/meta.ts';
import {
    addExperience,
    deleteExperience,
    getExperience,
    getSingleExperience,
    updateExperience
} from './controllers/experience.ts';
import {
    addEducation,
    deleteEducation,
    getEducation,
    getSingleEducation,
    updateEducation
} from './controllers/education.ts';
import { addSkill, deleteSkill, getSkill, getSkills, updateSkill } from './controllers/skills.ts';

const router = new Router();

router.get("/api/v1/products", getProducts)
    .get("/api/v1/products/:id", getProduct)
    .post("/api/v1/products", addProduct)
    .put("/api/v1/products/:id", updateProduct)
    .delete("/api/v1/products/:id", deleteProduct)

router.get("/api/v1/meta", getMeta)
    .get("/api/v1/meta/:id", getSingleMeta)
    .post("/api/v1/meta", addMeta)
    .put("/api/v1/meta/:id", updateMeta)
    .delete("/api/v1/meta/:id", deleteMeta)

router.get("/api/v1/experience", getExperience)
    .get("/api/v1/experience/:id", getSingleExperience)
    .post("/api/v1/experience", addExperience)
    .put("/api/v1/experience/:id", updateExperience)
    .delete("/api/v1/experience/:id", deleteExperience)

router.get("/api/v1/education", getEducation)
    .get("/api/v1/education/:id", getSingleEducation)
    .post("/api/v1/education", addEducation)
    .put("/api/v1/education/:id", updateEducation)
    .delete("/api/v1/education/:id", deleteEducation)

router.get("/api/v1/skills", getSkills)
    .get("/api/v1/skills/:id", getSkill)
    .post("/api/v1/skills", addSkill)
    .put("/api/v1/skills/:id", updateSkill)
    .delete("/api/v1/skills/:id", deleteSkill)

/**
 * TODO: implement Courses Routes
 */
// router.get("/api/v1/courses", getSkills)
//     .get("/api/v1/courses/:id", getSkill)
//     .post("/api/v1/courses", addSkill)
//     .put("/api/v1/courses/:id", updateSkill)
//     .delete("/api/v1/courses/:id", deleteSkill)

export default router;
