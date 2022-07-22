import {
  VStack,
  HStack,
  IconButton,
  useTheme,
  Text,
  Heading,
  FlatList,
  Center,
} from "native-base";
import Logo from "../assets/logo_secondary.svg";
import { SignOut } from "phosphor-react-native";
import { ChatTeardropText } from "phosphor-react-native";
import { useNavigation } from "@react-navigation/native";
import { Filter } from "../components/Filter";
import { useEffect, useState } from "react";
import { Order, OrderProps } from "../components/Order";
import { Button } from "../components/Button";
import { color } from "native-base/lib/typescript/theme/styled-system";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { Alert } from "react-native";
import { dateFormat } from "../Utils/firestoreDateFormat";

export function Home() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [statusSelected, setStatusSelected] = useState<"open" | "closed">(
    "open"
  );
  const [orders, setOrders] = useState<OrderProps[]>([]);

  const navigation = useNavigation();

  function handleNewOrder() {
    navigation.navigate("new");
  }

  function handleOpenDetails(orderId: string) {
    navigation.navigate("details", { orderId });
  }

  function handleLogout() {
    auth()
      .signOut()
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    setLoading(true);

    const subscriber = firestore()
      .collection("orders")
      .where("status", "==", statusSelected)
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const { patrimony, description, status, created_at } = doc.data();

          return {
            id: doc.id,
            patrimony,
            description,
            status,
            when: dateFormat(created_at),
          };
        });

        setOrders(data);
        setLoading(false);
      });

    return subscriber;
  }, []);

  useEffect(() => {
    console.log(orders, "eai?");
  }, [orders]);

  return (
    <VStack flex={1} pb={6} bg={"gray.700"}>
      <HStack
        w="full"
        justifyContent={"space-between"}
        alignItems={"center"}
        bg="gray.600"
        pt={12}
        pb={5}
        px={6}
      >
        <Logo />
        <IconButton
          onPress={handleLogout}
          icon={<SignOut size={26} color={colors.gray[300]} />}
        />
      </HStack>

      <VStack flex={1} px={6}>
        <HStack
          w="full"
          mt={8}
          mb={4}
          justifyContent="space-between"
          alignItems={"center"}
        >
          <Heading color="gray.100">Meus chamados</Heading>
          <Text color="gray.200">3</Text>
        </HStack>

        <HStack space={3} mb={8}>
          <Filter
            type="open"
            title="em andamento"
            onPress={() => setStatusSelected("open")}
            isActive={statusSelected === "open"}
          />
          <Filter
            type="closed"
            title="finalizado"
            onPress={() => setStatusSelected("closed")}
            isActive={statusSelected === "closed"}
          />
        </HStack>

        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Order onPress={() => handleOpenDetails(item.id)} data={item} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={() => (
            <Center>
              <ChatTeardropText color={colors.gray[300]} size={40} />
            </Center>
          )}
        ></FlatList>

        <Button onPress={handleNewOrder} title="Nova solicitacao" />
      </VStack>
    </VStack>
  );
}
