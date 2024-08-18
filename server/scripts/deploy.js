async function main() {
    const Registration = await ethers.getContractFactory("Register");
    const registration = await Registration.deploy();
    await registration.waitForDeployment();
    console.log("Registration deployed to:", registration.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
