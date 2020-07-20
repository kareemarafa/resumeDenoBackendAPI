import { Client } from "https://deno.land/x/postgres/mod.ts";
import { Education } from "../types.ts";
import { dbCreds } from "../config.ts";

//Init client
const client = new Client(dbCreds);

// @desc Get all Education
// @route GET /api/v1/education
const getEducation = async ({response}: { response: any }) => {
    try {
        await client.connect();
        const result = await client.query("SELECT * from education");
        const education: Education[] = [];
        result.rows.map((p) => {
            let obj: any = {};
            result.rowDescription.columns.map((el, i) => {
                obj[el.name] = p[i];
            });
            education.push(obj);
        });
        response.body = {
            success: true,
            data: education,
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

// @desc Get single Education
// @route GET /api/v1/education/:id
const getSingleEducation = async (
    {params, response}: { params: { id: string }; response: any },
) => {
    try {
        await client.connect();
        const result = await client.query(
            "SELECT * from education WHERE id = $1",
            params.id,
        );
        if (result.rows.toString() === "") {
            response.status = 404;
            response.body = {
                success: false,
                msg: `No education with the id of ${params.id}`,
            };
        } else {
            const education: any = {};
            result.rows.map((p) => {
                result.rowDescription.columns.map((el: any, i) => {
                    education[el.name] = p[i];
                });
                response.status = 200;
                response.body = {
                    success: true,
                    data: education,
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

// @desc Add Education
// @route POST /api/v1/education
const addEducation = async (
    {request, response}: { request: any; response: any },
) => {
    const body = await request.body();
    const education: Education = await body.value;
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
                "INSERT INTO education(title, due_date, description, course_list) VALUES($1, $2, $3, $4)",
                education.title,
                education.due_date,
                education.description,
                education.course_list,
            );
            response.status = 201;
            response.body = {
                success: true,
                data: education,
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

// @desc Update Education
// @route PUT /api/v1/education/:id
const updateEducation = async (
    {params, request, response}: {
        params: { id: string };
        request: any;
        response: any;
    },
) => {
    await getSingleEducation({params: {id: params.id}, response});
    if (response.status === 404) {
        response.body = {
            success: false,
            msg: response.body.msg,
        };
        response.status = 404;
        return;
    } else {
        const body = await request.body();
        const education = await body.value;
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
                    "UPDATE education SET title=$1, due_date=$2, description=$3, course_list=$4 WHERE id=$5",
                    education.title,
                    education.due_date,
                    education.description,
                    education.course_list,
                    params.id,
                );
                response.status = 200;
                response.body = {
                    success: true,
                    data: education,
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

// @desc Delete Education
// @route DELETE /api/v1/education/:id
const deleteEducation = async (
    {params, response}: { params: { id: string }; response: any },
) => {
    await getSingleEducation({params: {id: params.id}, response});
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
                "DELETE FROM education WHERE id=$1",
                params.id,
            );
            response.body = {
                success: true,
                msg: `Education with id ${params.id} has been deleted!`,
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

export { getEducation, getSingleEducation, addEducation, updateEducation, deleteEducation };
