import Constants from "expo-constants";


export const getVersion = ()=>{
    
    const version = Constants.expoConfig?.version
    
    return "V " + version;
}