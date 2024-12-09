import { betterAuth } from "better-auth";
 
export const auth = betterAuth({
    account: {
        accountLinking: {
          enabled: true,
        },
      },
})