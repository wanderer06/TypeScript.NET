/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
import SystemException from "./SystemException";
export default class ArgumentException extends SystemException {
    paramName: string;
    constructor(paramName: string, message?: string, innerException?: Error, beforeSealing?: (ex: any) => void);
    protected getName(): string;
}