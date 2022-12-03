export interface IWakaAuthResponse {
  access_token?: string,
  expires_at?: string,
  expires_in?: string,
  refresh_token?: string,
  scope?: string,
  token_type?: string,
  uid?: string
}

export interface IWakaAuthRequestData {
  client_id: string,
  client_secret: string,
  redirect_uri: string,
  grant_type: 'authorization_code' | 'refresh_token',
  code?: string,
  refresh_token?: string
}

export interface IWakaTimeConfig {
  appId: string,
  appSecret: string,
  redirectUri: string,
}
