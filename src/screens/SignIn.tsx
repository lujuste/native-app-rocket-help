import { VStack, Heading, Icon, useTheme } from "native-base";
import Logo from "../assets/logo_primary.svg";
import { Input } from "../components/Input";
import { Envelope, Key } from "phosphor-react-native";
import { Button } from "../components/Button";
import auth from "@react-native-firebase/auth";

import { useState } from "react";
import { Alert } from "react-native";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  function handleSignIn() {
    if (!email || !password) {
      return Alert.alert("Entrar", "Informe email e senha");
    }

    setIsLoading(true);

    auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        console.log(response, "o que vem?");
      })
      .catch((error) => {
        console.log(error.code, "error when auth firebase");
        setIsLoading(false);
      });
  }

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo />
      <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
        Acesse sua conta
      </Heading>
      <Input
        placeholder="E-mail"
        mb={4}
        InputLeftElement={
          <Icon as={<Envelope color={colors.gray[300]} />} ml={4} />
        }
        onChangeText={setEmail}
      />
      <Input
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
        placeholder="Senha"
        secureTextEntry
        onChangeText={setPassword}
      />

      <Button
        isLoading={isLoading}
        onPress={handleSignIn}
        title="Entrar"
        w="full"
      />
    </VStack>
  );
}
