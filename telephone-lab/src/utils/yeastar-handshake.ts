interface BaseYeastarResponse {
  errcode: number;
  errmsg: string;
}

export class YeastarSignature {
  /**
   * @param {string} AccessID
   * @param {string} AccessKey
   * @param {string} apiUrl
   */
  constructor(
    private AccessID: string,
    private AccessKey: string,
    private apiUrl: string,
  ) {}

  private apiClient<D = unknown, E = unknown>(
    url: string,
    data: Record<string, unknown>,
  ) {
    return fetch(this.apiUrl + url, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((resp) => [resp.json(), null] as [D, null])
      .catch((e) => [null, e] as [null, E]);
  }

  private error: BaseYeastarResponse | null = null;

  private async getToken() {
    interface Data extends BaseYeastarResponse {
      access_token_expire_time: number;
      access_token: string;
      refresh_token_expire_time: number;
      refresh_token: string;
    }

    const [data, error] = await this.apiClient<Data>(
      "/openapi/v1.0/get_token",
      {
        username: this.AccessID,
        password: this.AccessKey,
      },
    );
    console.log({ data, error });
  }
}
