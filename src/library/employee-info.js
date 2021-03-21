const axios = require("axios");
const logger = require("./logger");
const { GET_ASYNC, SET_ASYNC } = require("./redis-client");

const getEmployees = async () => {
  try {
    const reply = await GET_ASYNC("employeeData");
    if (reply) {
      logger.log({ message: "using cached data", level: "info" });
      return JSON.parse(reply);
    }
    const response = await axios({
      method: "get",
      url: `${process.env.EMPLOYEES_URI}`,
      timeout: 5 * 1000,
    });
    await SET_ASYNC(
      "employeeData",
      JSON.stringify(response.data.data),
      "EX",
      10
    );
    logger.log({ message: "new cached data", level: "info" });
    return response.data.data;
  } catch (error) {
    logger.log({ message: error.message, level: "error" });
  }
};

const getEmployeeInfo = async (employeeId) => {
  const employees = await getEmployees();
  if (!employees) {
    return { InternalError: "Can't get owner info, Please try later" };
  }
  const employee = employees.find((emp) => {
    return emp.id == employeeId;
  });
  if (!employee) {
    return { IdError: "Invalid owner id" };
  }
  return employee;
};

module.exports = getEmployeeInfo;
