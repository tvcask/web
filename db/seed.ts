async function main() {
  console.log("No fake seed data is provided. Import real metadata into PostgreSQL before running catalog search.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
