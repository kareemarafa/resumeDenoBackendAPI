import { Client } from "https://deno.land/x/postgres/mod.ts";
import { Meta } from "../types.ts";
import { dbCreds } from "../config.ts";

//Init client
const client = new Client(dbCreds);

// @desc Get all Metas
// @route GET /api/v1/metas
const getMeta = async ({ response }: { response: any }) => {
  try {
    await client.connect();
    const result = await client.query("SELECT * from meta");
    const metas: Meta[] = [];
    result.rows.map((p) => {
      let obj: any = {};
      result.rowDescription.columns.map((el, i) => {
        obj[el.name] = p[i];
      });
      metas.push(obj);
    });
    response.body = {
      success: true,
      data: metas,
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

// @desc Get single Meta
// @route GET /api/v1/metas/:id
const getSingleMeta = async (
  { params, response }: { params: { id: string }; response: any },
) => {
  try {
    await client.connect();
    const result = await client.query(
      "SELECT * from meta WHERE id = $1",
      params.id,
    );
    if (result.rows.toString() === "") {
      response.status = 404;
      response.body = {
        success: false,
        msg: `No meta with the id of ${params.id}`,
      };
    } else {
      const meta: any = {};
      result.rows.map((p) => {
        result.rowDescription.columns.map((el: any, i) => {
          meta[el.name] = p[i];
        });
        response.status = 200;
        response.body = {
          success: true,
          data: meta,
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

// @desc Add Meta
// @route POST /api/v1/metas
const addMeta = async (
  { request, response }: { request: any; response: any },
) => {
  const body = await request.body();
  const meta: Meta = await body.value;
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
        "INSERT INTO meta(key, value, description) VALUES($1, $2, $3)",
        meta.key,
        meta.value,
        meta.description,
      );
      response.status = 201;
      response.body = {
        success: true,
        data: meta,
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

// @desc Update Meta
// @route PUT /api/v1/metas/:id
const updateMeta = async (
  { params, request, response }: {
    params: { id: string };
    request: any;
    response: any;
  },
) => {
  await getSingleMeta({ params: { id: params.id }, response });
  if (response.status === 404) {
    response.body = {
      success: false,
      msg: response.body.msg,
    };
    response.status = 404;
    return;
  } else {
    const body = await request.body();
    const meta = await body.value;
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
          "UPDATE meta SET key=$1, value=$2, description=$3 WHERE id=$4",
          meta.key,
          meta.value,
          meta.description,
          params.id,
        );
        response.status = 200;
        response.body = {
          success: true,
          data: meta,
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

// @desc Delete Meta
// @route DELETE /api/v1/metas/:id
const deleteMeta = async (
  { params, response }: { params: { id: string }; response: any },
) => {
  await getSingleMeta({ params: { id: params.id }, response });
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
        "DELETE FROM meta WHERE id=$1",
        params.id,
      );
      response.body = {
        success: true,
        msg: `Meta with id ${params.id} has been deleted!`,
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

export { getMeta, getSingleMeta, addMeta, updateMeta, deleteMeta };
