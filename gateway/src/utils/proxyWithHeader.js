import proxy from "express-http-proxy";

export const proxyWithHeader = (serviceUrl) =>
  proxy(serviceUrl, {
    parseReqBody: false,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      if (srcReq.headers) {
        proxyReqOpts.headers["x-user"] = JSON.stringify(srcReq.user);
      }
      return proxyReqOpts;
    },
  });

// export const proxyWithHeader = (serviceUrl) => {
//   return (req, res, next) => {
//     const isMultipart = req.headers["content-type"]?.startsWith(
//       "multipart/form-data",
//     );

//     return proxy(serviceUrl, {
//       parseReqBody: !isMultipart,

//       proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
//         if (srcReq.user) {
//           proxyReqOpts.headers["x-user"] = JSON.stringify(srcReq.user);
//         }

//         return proxyReqOpts;
//       },
//     })(req, res, next);
//   };
// };
