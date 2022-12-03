import {auth, connectDB, validate} from "../../../server/middlewares";
import {userController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import {getUsers} from "server/validations/user.validation";

const handler = (async (req, res) => {
	await middlewares(req, res);
	await runMiddleware(req, res, auth(req, res, "MANAGE_ALL_USER", "GET_ALL_USER"));
	await runMiddleware(req, res, validate(req, res, getUsers));

	if (req.method === "GET") {
		await userController.getUsers(req, res);
	}
});

export default connectDB(handler);
