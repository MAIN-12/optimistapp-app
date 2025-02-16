import ReactSwagger from "./react-swagger";
import swaggerSpec from "@/lib/swagger-spec";

export default function IndexPage() {
    return (
        <section className="container bg-white p-4 rounded mb-32 shadow-lg">
            <ReactSwagger spec={swaggerSpec} />
        </section>
    );
}
