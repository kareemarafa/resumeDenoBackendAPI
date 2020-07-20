import { Client } from "https://deno.land/x/postgres/mod.ts";
import { Experience } from "../types.ts";
import { dbCreds } from "../config.ts";

//Init client
const client = new Client(dbCreds);

// @desc Get all Experience
// @route GET /api/v1/experience
const getExperience = async ({response}: { response: any }) => {
    try {
        await client.connect();
        const result = await client.query("SELECT * from experience");
        const experiences: Experience[] = [];
        result.rows.map((p) => {
            let obj: any = {};
            result.rowDescription.columns.map((el, i) => {
                obj[el.name] = p[i];
            });
            experiences.push(obj);
        });
        response.body = {
            success: true,
            data: experiences,
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

// @desc Get single Experience
// @route GET /api/v1/experience/:id
const getSingleExperience = async (
    {params, response}: { params: { id: string }; response: any },
) => {
    try {
        await client.connect();
        const result = await client.query(
            "SELECT * from experience WHERE id = $1",
            params.id,
        );
        if (result.rows.toString() === "") {
            response.status = 404;
            response.body = {
                success: false,
                msg: `No experience with the id of ${params.id}`,
            };
        } else {
            const experience: any = {};
            result.rows.map((p) => {
                result.rowDescription.columns.map((el: any, i) => {
                    experience[el.name] = p[i];
                });
                response.status = 200;
                response.body = {
                    success: true,
                    data: experience,
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

// @desc Add Experience
// @route POST /api/v1/experiences
const addExperience = async (
    {request, response}: { request: any; response: any },
) => {
    const body = await request.body();
    const experience: Experience = await body.value;
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
                "INSERT INTO experience(role, role_description, company_name, company_website, start_date, end_date, current, company_location) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
                experience.role,
                experience.role_description,
                experience.company_name,
                experience.company_website,
                experience.start_date,
                experience.end_date,
                experience.current,
                experience.company_location,
            );
            response.status = 201;
            response.body = {
                success: true,
                data: experience,
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

// @desc Update Experience
// @route PUT /api/v1/experiences/:id
const updateExperience = async (
    {params, request, response}: {
        params: { id: string };
        request: any;
        response: any;
    },
) => {
    await getSingleExperience({params: {id: params.id}, response});
    if (response.status === 404) {
        response.body = {
            success: false,
            msg: response.body.msg,
        };
        response.status = 404;
        return;
    } else {
        const body = await request.body();
        const experience = await body.value;
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
                    "UPDATE experience SET role=$1, role_description=$2, company_name=$3, company_website=$4, start_date=$5, end_date=$6, current=$7, company_location=$8 WHERE id=$9",
                    experience.role,
                    experience.role_description,
                    experience.company_name,
                    experience.company_website,
                    experience.start_date,
                    experience.end_date,
                    experience.current,
                    experience.company_location,
                    params.id,
                );
                response.status = 200;
                response.body = {
                    success: true,
                    data: experience,
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

// @desc Delete Experience
// @route DELETE /api/v1/experiences/:id
const deleteExperience = async (
    {params, response}: { params: { id: string }; response: any },
) => {
    await getSingleExperience({params: {id: params.id}, response});
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
                "DELETE FROM experience WHERE id=$1",
                params.id,
            );
            response.body = {
                success: true,
                msg: `Experience with id ${params.id} has been deleted!`,
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

export { getExperience, getSingleExperience, addExperience, updateExperience, deleteExperience };
