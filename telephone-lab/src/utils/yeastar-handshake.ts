interface BaseYeastarResponse {
  errcode: number;
  errmsg: string;
}

interface ConstructorInput {
  AccessID: string;
  AccessKey: string;
  apiUrl: string;
  username: string;
}

export class YeastarSignature {
  private AccessID: string;
  private AccessKey: string;
  private apiUrl: string;
  private username: string;

  constructor({ AccessID, AccessKey, apiUrl, username }: ConstructorInput) {
    this.AccessID = AccessID;
    this.AccessKey = AccessKey;
    this.apiUrl = apiUrl;
    this.username = username;
  }

  private apiClient<D = unknown, E = unknown>(
    url: string,
    method: string,
    data: Record<string, unknown>,
  ) {
    return fetch(this.apiUrl + url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((resp) => [resp.json(), null] as [D, null])
      .catch((e) => [null, e] as [null, E]);
  }

  private getToken() {
    interface Data extends BaseYeastarResponse {
      access_token_expire_time: number;
      access_token: string;
      refresh_token_expire_time: number;
      refresh_token: string;
    }

    return this.apiClient<Data>("/openapi/v1.0/get_token", "POST", {
      username: this.AccessID,
      password: this.AccessKey,
    });
  }

  private getSignature(access_token: string, username: string) {
    interface Data extends BaseYeastarResponse {
      data: { sign: string };
    }

    return this.apiClient<Data>(
      `/openapi/v1.0/sign/create?access_token=${access_token}`,
      "POST",
      {
        username,
        sign_type: "sdk",
        expire_time: 0,
      },
    );
  }

  async handshake() {
    // GetToken
    const [tokenData, tokenError] = await this.getToken();
    // GetToken Error Handling
    if (tokenError) throw new Error("GetTokenError:", { cause: tokenError });
    if (tokenData === null)
      throw new Error("GetTokenDataNull:", { cause: { tokenData } });

    // Get Signature with data from GetToken
    const [signData, signError] = await this.getSignature(
      tokenData.access_token,
      this.username,
    );
    // GetSignature Error Handling
    if (signError) throw new Error("GetSignature:", { cause: signError });
    if (signData === null)
      throw new Error("GetSignatureDataNull:", { cause: { signData } });

    // Return Signature
    return signData;
  }
}
