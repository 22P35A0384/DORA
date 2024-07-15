import { ParamListBase, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// navigationTypes.ts
type NativeStackScreenProps<ParamList extends ParamListBase, RouteName extends keyof ParamList = string, NavigatorID extends string | undefined = undefined> = {
    navigation: NativeStackNavigationProp<ParamList, RouteName, NavigatorID>;
    route: RouteProp<ParamList, RouteName>;
  };
  
  export default NativeStackScreenProps;
  