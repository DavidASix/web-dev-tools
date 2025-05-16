import axios from "axios";
import { z, type ZodTypeAny } from "zod";
import type { APISchema } from "@/schema/types";

/**
 * A method to perform a GET request with validated and type safe response data schemas.
 *
 * @param apiSchema An APISchema object that defines the API endpoint, request schema, and response schema.
 * @param config A configuration object for the axios request, which can include headers, params, etc.
 * @returns A promise that resolves to the parsed response data, validated against the response schema defined in the apiSchema.
 */
async function get<
  TReqSchema extends ZodTypeAny,
  TRespSchema extends ZodTypeAny,
>(
  apiSchema: APISchema<TReqSchema, TRespSchema>,
  config?: Parameters<typeof axios.get>[1],
): Promise<z.infer<TRespSchema>> {
  const { url, response } = apiSchema;
  const { data: responseData } = await axios.get(url, config);

  const parsed = response.parse(responseData);
  return parsed;
}

/**
 * A method to perform a POST request with validated and type safe request and response data schemas.
 *
 * @param apiSchema An APISchema object that defines the API endpoint, request schema, and response schema.
 * @param body The request body to be sent in the POST request, which will be validated against the request schema defined in the apiSchema.
 * @param config A configuration object for the axios request, which can include headers, params, etc.
 * @returns A promise that resolves to the parsed response data, validated against the response schema defined in the apiSchema.
 */
async function post<
  TReqSchema extends ZodTypeAny,
  TRespSchema extends ZodTypeAny,
>(
  apiSchema: APISchema<TReqSchema, TRespSchema>,
  body: unknown,
  config?: Parameters<typeof axios.post>[2],
): Promise<z.infer<TRespSchema>> {
  const { url, request, response } = apiSchema;
  const parsedBody = request.parse(body);
  const { data } = await axios.post(url, parsedBody, config);
  const parsed = response.parse(data);
  return parsed;
}

const requests = {
  get,
  post,
};

export default requests;
