import ReactSwagger from "./react-swagger";
import { getApiDocs } from "@/lib/swagger";

export default async function IndexPage() {
    const spec = await getApiDocs();
    return (
        <section className="container bg-white p-4 rounded mb-32 shadow-lg">
            <ReactSwagger spec={spec} />
        </section>
    );
}