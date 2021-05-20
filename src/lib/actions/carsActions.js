import carsApi from "../apis/carsApi"

// TODO: hook up redux store and dispatch
export const uploadCars = (formValues) =>  async (dispatch, getState) => {
	console.log(`[actions/index.js] - uploadCars() -> trying to create car with values: `, formValues)
	const {dealerId} = getState().auth
	const response = await carsApi.post('/cars', {...formValues, dealerId})
	// dispatch({type: CREATE_CARS, payload: response.data})
	// Note: want to navigate AFTER successful creation of new car(s)
	history.push('/')
}
