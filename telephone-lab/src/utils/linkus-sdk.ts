import { yeastar } from "@/credentials";
import { PhoneOperator, init } from "ys-webrtc-sdk-core";

interface InitLinkusCredentials {
  username: string;
  secret: string;
}

interface InitLinkusOptions {
  phone_beforeStart?: (
    phone: PhoneOperator,
    destroy: () => void,
  ) => void | Promise<void>;
  phone_afterStart?: (
    phone: PhoneOperator,
    destroy: () => void,
  ) => void | Promise<void>;
  sdk_onError?: (error: unknown) => void | Promise<void>;
}

// ////////////////////////////////////////
// Linkus SDK Integration
// ////////////////////////////////////////
export function initLinkus(
  credentials: InitLinkusCredentials,
  options: InitLinkusOptions = {},
) {
  const { username, secret } = credentials;
  if (username.length <= 0)
    throw new Error("InitLinkus:", {
      cause: { msg: "Username not provided", username },
    });
  if (secret.length <= 0)
    throw new Error("InitLinkus:", {
      cause: { msg: "Secret not provided", secret },
    });

  const { phone_beforeStart, phone_afterStart, sdk_onError } = options;
  init({
    pbxURL: yeastar.BaseURL,
    username,
    secret,
  })
    .then((operator) => {
      const { phone, destroy } = operator;

      // Call before start hook
      if (phone_beforeStart) phone_beforeStart(phone, destroy);

      // Must start after listening for events
      // start registering the SIP UA.
      phone.start();

      // Call the after start hook
      if (phone_afterStart) phone_afterStart(phone, destroy);
    })
    .catch((err) => {
      if (sdk_onError) sdk_onError(err);
      throw new Error("LinkusSdkError:", { cause: err });
    });
}
