import { Client } from "https://deno.land/x/postgres/mod.ts";
import { Skill } from "../types.ts";
import { dbCreds } from "../config.ts";

//Init client
const client = new Client(dbCreds);

// @desc Get all Skills
// @route GET /api/v1/skills
const getSkills = async ({response}: { response: any }) => {
    try {
        await client.connect();
        const result = await client.query("SELECT * from skills");
        const skills: any[] = [];
        result.rows.map((p) => {
            let obj: any = {};
            result.rowDescription.columns.map((el, i) => {
                obj[el.name] = p[i];
            });
            skills.push(obj);
        });
        response.body = {
            success: true,
            data: skills,
        };
    } catch (err) {
        response.status = 500;
        response.body = {
            success: false,
            msg: err.toString(),
        };
    } finally {
        await client.end();
    }
};

// @desc Get single Skill
// @route GET /api/v1/skills/:id
const getSkill = async (
    {params, response}: { params: { id: string }; response: any },
) => {
    try {
        await client.connect();
        const result = await client.query(
            "SELECT * from skills WHERE id = $1",
            params.id,
        );
        if (result.rows.toString() === "") {
            response.status = 404;
            response.body = {
                success: false,
                msg: `No skill with the id of ${params.id}`,
            };
        } else {
            const skill: any = {};
            result.rows.map((p) => {
                result.rowDescription.columns.map((el: any, i) => {
                    skill[el.name] = p[i];
                });
                response.status = 200;
                response.body = {
                    success: true,
                    data: skill,
                };
            });
        }
    } catch (err) {
        response.status = 500;
        response.body = {
            success: false,
            msg: err.toString(),
        };
    } finally {
        await client.end();
    }
};

// @desc Add Skill
// @route POST /api/v1/skills
const addSkill = async (
    {request, response}: { request: any; response: any },
) => {
    const body = await request.body();
    const skill = await body.value;
    if (!request.hasBody) {
        response.status = 400;
        response.body = {
            success: false,
            msg: "Validation Error!",
        };
    } else {
        try {
            await client.connect();
            const result = await client.query(
                "INSERT INTO skills(title, progress) VALUES($1, $2)",
                skill.title,
                skill.progress,
            );
            response.status = 201;
            response.body = {
                success: true,
                data: skill,
            };
        } catch (err) {
            response.status = 500;
            response.body = {
                success: false,
                msg: err.toString(),
            };
        } finally {
            await client.end();
        }
    }
};

// @desc Update Skill
// @route PUT /api/v1/skills/:id
const updateSkill = async (
    {params, request, response}: {
        params: { id: string };
        request: any;
        response: any;
    },
) => {
    await getSkill({params: {id: params.id}, response});
    if (response.status === 404) {
        response.body = {
            success: false,
            msg: response.body.msg,
        };
        response.status = 404;
        return;
    } else {
        const body = await request.body();
        const skill = await body.value;
        if (!request.hasBody) {
            response.status = 400;
            response.body = {
                success: false,
                msg: "Validation Error!",
            };
        } else {
            try {
                await client.connect();
                const result = await client.query(
                    "UPDATE skills SET title=$1, progress=$2 WHERE id=$3",
                    skill.title,
                    skill.progress,
                    params.id,
                );
                response.status = 200;
                response.body = {
                    success: true,
                    data: skill,
                };
            } catch (err) {
                response.status = 500;
                response.body = {
                    success: false,
                    msg: err.toString(),
                };
            } finally {
                await client.end();
            }
        }
    }
};

// @desc Delete Skill
// @route DELETE /api/v1/skills/:id
const deleteSkill = async (
    {params, response}: { params: { id: string }; response: any },
) => {
    await getSkill({params: {id: params.id}, response});
    if (response.status === 404) {
        response.body = {
            success: false,
            msg: response.body.msg,
        };
        response.status = 404;
        return;
    } else {
        try {
            await client.connect();
            const result = await client.query(
                "DELETE FROM skills WHERE id=$1",
                params.id,
            );
            response.body = {
                success: true,
                msg: `Skill with id ${params.id} has been deleted!`,
            };
            response.status = 204;
        } catch (err) {
            response.status = 500;
            response.body = {
                success: false,
                msg: err.toString(),
            };
        } finally {
            await client.end();
        }
    }
};

export { getSkills, getSkill, addSkill, updateSkill, deleteSkill };
