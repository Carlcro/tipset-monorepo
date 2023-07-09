import React from "react";

import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "@acme/api";

import { trpc } from "../utils/trpc";

const SignOut = () => {
  const { signOut } = useAuth();
  return (
    <View className="rounded-lg border-2 border-gray-500 p-4">
      <Button
        title="Sign Out"
        onPress={() => {
          signOut();
        }}
      />
    </View>
  );
};

const CreatePost: React.FC = () => {
  const utils = trpc.useContext();

  const [title, onChangeTitle] = React.useState("");
  const [content, onChangeContent] = React.useState("");

  return (
    <View className="flex flex-col border-t-2 border-gray-500 p-4">
      <TextInput
        className="text-white mb-2 rounded border-2 border-gray-500 p-2"
        onChangeText={onChangeTitle}
        placeholder="Title"
      />
      <TextInput
        className="text-white mb-2 rounded border-2 border-gray-500 p-2"
        onChangeText={onChangeContent}
        placeholder="Content"
      />
      <TouchableOpacity className="rounded bg-[#cc66ff] p-2">
        <Text className="text-white font-semibold">Publish post</Text>
      </TouchableOpacity>
    </View>
  );
};

export const HomeScreen = () => {
  const [showPost, setShowPost] = React.useState<string | null>(null);
  const utMutation = trpc.userTournament.createUserTournament.useMutation();

  const tournaments = trpc.userTournament.getUserTournaments.useQuery();

  return (
    <SafeAreaView className="bg-[#2e026d] bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <View className="h-full w-full p-4">
        <Text className="text-white mx-auto pb-2 text-5xl font-bold">
          Create <Text className="text-[#cc66ff]">T3</Text> Turbo
        </Text>
        <Text>{tournaments.data?.length}</Text>

        {tournaments.data?.map((x) => (
          <Text>{JSON.stringify(x.members.map((z) => z.fullName))}</Text>
        ))}

        <TouchableOpacity
          onPress={createUserTournament}
          className="rounded bg-[#cc66ff] p-2"
        >
          <Text className="text-white font-semibold">Publish post</Text>
        </TouchableOpacity>
        <SignOut />
      </View>
    </SafeAreaView>
  );
};
