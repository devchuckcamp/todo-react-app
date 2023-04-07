
class Config {
    base_api_url:string = import.meta.env.VITE_REACT_APP_API_BASE_URL
    api_port:string = import.meta.env.VITE_REACT_APP_API_PORT
    api_version:string = import.meta.env.VITE_REACT_APP_API_VERSION_Prefix+ import.meta.env.VITE_REACT_APP_API_VERSION
    api_url:string = this.base_api_url+':'+this.api_port+'/api/'+this.api_version

    GetAPIURL():string{
        return this.api_url;
    }
}

export default Config;