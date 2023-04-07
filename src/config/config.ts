
class Config {
    public base_api_url:string = ""
       
    public api_port:string =  ""
    public api_version:string = ""
    public api_url:string = "http://localhost"

    constructor(env:any){
        this.base_api_url = env.VITE_REACT_APP_API_BASE_URL
        this.api_port =  ':'+env.VITE_REACT_APP_API_PORT

        if(env.VITE_REACT_APP_ENV_PRODUCTION == 1) {
            this.base_api_url = env.VITE_REACT_APP_API_PROD_BASE_URL
            this.api_port =  ""
        }

       
        this.api_version = env.VITE_REACT_APP_API_VERSION_Prefix+ env.VITE_REACT_APP_API_VERSION
        this.api_url = this.base_api_url+this.api_port+'/api/'+this.api_version
    }
   

    GetAPIURL():string{
        return this.api_url;
    }
}

export default Config;