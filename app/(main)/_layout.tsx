import { Stack, Tabs } from "expo-router";
import "../global.css";
import {Ionicons} from "@expo/vector-icons"

export default function MainLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{title:'Home', tabBarIcon: ({color, size}) =>  <Ionicons name="home" color={color} size={size}/>,}}/>
      <Tabs.Screen name='categories' options={{title:'Categories', tabBarIcon: ({color, size}) =>  <Ionicons name="grid" color={color} size={size}/>,}}/>
      <Tabs.Screen name='cart' options={{title:'Cart', tabBarIcon: ({color, size}) =>  <Ionicons name="cart" color={color} size={size}/>,}}/>
      <Tabs.Screen name='orders' options={{title:'Orders', tabBarIcon: ({color, size}) =>  <Ionicons name="receipt" color={color} size={size}/>,}}/>
      <Tabs.Screen name='profile' options={{title:'Profile', tabBarIcon: ({color, size}) =>  <Ionicons name="person" color={color} size={size}/>,}}/>
      </Tabs>
    
  );
} 