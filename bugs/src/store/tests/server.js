import { Server, Model, Response, RestSerializer, Serializer } from "miragejs";

const AppSerializer = RestSerializer.extend({
  root: false,
  embed: true,
});

const errorResponse = new Response(
  500,
  {},
  { message: "Error throw because 'throwApiError' is enabled." }
);

export default function makeServer() {
  try {
    const server = new Server({
      throwApiError: false,
      models: {
        bug: Model.extend(),
      },
      serializers: {
        application: AppSerializer,
      },
      routes() {
        this.namespace = "api";
        this.urlPrefix = "http://localhost:9001/";
        this.timing = 0;
        this.resource("bug");
        this.get("/bugs", (schema, request) => {
          if (this.throwApiError) {
            return errorResponse;
          }

          return schema.bugs.all();
        });

        this.post("/bugs", (schema, request) => {
          if (this.throwApiError) {
            return errorResponse;
          }

          const attributes = JSON.parse(request.requestBody);
          return schema.bugs.create(attributes);
        });

        this.patch("/bugs/:id", (schema, request) => {
          const id = request.params.id;
          const attributes = JSON.parse(request.requestBody);

          if (this.throwApiError) {
            return new Response(500, {}, {});
          }

          return schema.bugs.find(id).update(attributes);
        });
      },
      seeds(server) {
        server.db.loadData({
          bugs: [{ description: "1st bug" }],
        });
      },
    });

    return server;
  } catch (error) {
    const e = error;
    debugger;
  }
}
