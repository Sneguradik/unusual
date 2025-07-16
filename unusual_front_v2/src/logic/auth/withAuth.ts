import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { jwtDecode } from "jwt-decode";
import { IJwtPayload } from "@logic/Entities";

type WithAuthOptions = {
  roles?: string[];
};

export function withAuth<P extends { [key: string]: any }>(
  gssp: GetServerSideProps<P>,
  options: WithAuthOptions = {}
): GetServerSideProps<P> {
  return async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const token = context.req.cookies["token"];

    if (!token) {
      return {
        redirect: {
          destination: "/auth/login",
          permanent: false,
        },
      };
    }

    let payload: IJwtPayload;
    try {
      payload = jwtDecode<IJwtPayload>(token);
    } catch (err) {
      console.error("Invalid token:", err);
      return {
        redirect: {
          destination: "/auth/login",
          permanent: false,
        },
      };
    }

    const userRole = payload?.role;
    const allowedRoles = options.roles;

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return {
        redirect: {
          destination: "/403",
          permanent: false,
        },
      };
    }

    return await gssp(context);
  };
}
