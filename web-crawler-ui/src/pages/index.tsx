import { redirect } from "@/utils/utils";

export default function HomeScreen() {
  return null;
}

export async function getServerSideProps() {
    return redirect("/dashboard");
}
