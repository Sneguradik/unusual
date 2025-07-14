export interface IFilterDescription {
  id: number,
  name: string
  description: string,
}

export interface IFilter{
  description: IFilterDescription,
  condition : IFilterCondition
  value: number
  type : IFilterType
  useTrigger : boolean
  active : boolean
}

export enum IFilterType {
  And,
  Or
}

export enum IFilterCondition
{
  Equals,
  Less,
  Greater,
  LessOrEquals,
  GreaterOrEquals,
  NotEquals,
}

export interface IErrorMessage {
  title : string
  status : number
  detail : string
  instance : string
}

export interface ITradeStatAnalyzed {

  assetCode : string;
  currency: string;
  tradeMemberName: string;
  account: string;
  clientCode: string;
  clientLegalCode: string;
  contraClientsQty: number;
  tradedAssets: number;
  dealsQty: number;
  avgDealsPerContra: number;
  ordersQty: number;
  avgOrdersPerContra: number;
  avgOrdersPerAsset: number;

  minDealTime?: string;
  maxDealTime?: string;
  dealTimeDelta: number;
  avgTimeBtwOrdersSecs: number;

  volMoney: number;
  avgVolPerContra: number;
  volLots: number;
  avgDealVol: number;
  maxDealVol: number;
  avgDealPrice: number;

  finRes: number;
  finResAbs: number;
  finResExt?: number;
  finResExtAbs?: number;
  finResInt?: number;
  finResIntAbs?: number;

  cost: number;

  tradeDate: string;

  totalScore: number;
  toDelete: boolean;
}
export interface ITradeStatsRequest {
  startDate: string
  endDate: string
  currency: string
  excludedCodes: string,
  presetId: number | null,
  filters: IFilter[],
}

export interface ILoginCredentials {
  email: string
  password: string
}

export interface IClientLoginCredentials extends ILoginCredentials {
  remember: string;
}

export interface IAuthenticatedUser extends IUser{
  tokenPair : ITokenPair,
}

export interface IUser{
  id: number,
  username: string,
  email: string,
  role: string,
}

export interface ITokenPair{
  token: string,
  refreshToken: string
}
export interface IJwtPayload {
  jti: string,
  name: string,
  email: string,
  sub: number,
  role: string,
  exp: number,
  iss: string,
  aud: string,
}

export interface ICurrency {
  id: number,
  name: string,
  symbol: string,

}

export interface IPreset extends IFilterMessage{
  id: number;
  name: string;
  owner: IUser;
  isDefault: boolean;
  isPublic: boolean;
}

export interface IFilterMessage{
  currency: ICurrency;
  excludedCodes: string,
  filters: IFilter[],
}