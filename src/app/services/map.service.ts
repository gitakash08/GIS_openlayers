import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpBackend } from '@angular/common/http';
import { _throw as throwError } from 'rxjs/observable/throw';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(
    private http: HttpClient,

    handler: HttpBackend,
  ) {
    this.http = new HttpClient(handler);
  }

  // getPMKVYData(state: string, district: string, scheme: string, trainingtype:string) {
  //   debugger;
  //   return this.http.get("https://gis-api.nsdcindia.co/getPMKVYData?scheme="+scheme+"&state="+state+"&district="+district+"&trainingtype="+trainingtype+"").pipe(
  //     catchError(this.handleError)
  //   );
  // }

  getPMKVYData(state: string, district: string, scheme: string, trainingtype: string, methodAPI: string) {
    debugger;
    let inputParams;
    if (methodAPI == 'indiactrainingtype')
      inputParams = "scheme=" + trainingtype + "&type=" + scheme;
    else if (methodAPI == 'indiacstatetrainingtype')
      inputParams = "scheme=" + trainingtype + "&state=" + state + "&type=" + scheme;
    else if (methodAPI == 'indiacstatedistricttrainingtype')
      inputParams = "scheme=" + trainingtype  + "&districtcode=" + district + "&type=" + scheme;

      console.log("https://www.pmkvyofficial.org/" + methodAPI + "?" + inputParams);
    return this.http.get("https://www.pmkvyofficial.org/" + methodAPI + "?" + inputParams).pipe(
      catchError(this.handleError)
    );
  }

  getCourse(tc_id: string, source_system: string) {
    debugger;
    return this.http.get("https://gis-api.nsdcindia.co/getCourseData?tc_id="+ tc_id + "&source_system=" + source_system).pipe(
      catchError(this.handleError)
    );
  }

  SqlFeatureLayer(getName) {
    return this.http.get(environment.api_url + '/api/getTopFivepCourse?format=json&district=' + getName).pipe(
      // catchError(this.handleError.bind(this))
    );

  }

  dataFeaturesLayerData(getName): Observable<any> {
    debugger;
    return this.http.get(environment.api_url + '/api/getTopFivepCourse?format=json&district=' + getName);
  }

  getDistrict(): Observable<any> {

    return this.http.get('https://dev-gis-mapserver.nsdcindia.co/geoserver/SIM_DISTRICT/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SIM_DISTRICT%3ATown&outputFormat=application%2Fjson');
  }

  dataFeaturesLayerDataUser(encoded_data): Observable<any> {
    debugger;
    return this.http.get('https://nominatim.openstreetmap.org/reverse?' + encoded_data);
  }

  dataFeaturesLayer(): Observable<any> {
    return this.http.get(environment.api_url + '/api/getCityLatLong');
  }
  getPosts() {
    return this.http.get(environment.api_url + "/api/getTopCouseDetails").pipe(
      catchError(this.handleError)
    );
  }

  getTopCouseDetails(scheme: string, state: string, district: string) {
    return this.http.get(environment.api_url + "/api/getTopCouseDetails?scheme=" + scheme + "&state=" + state + "&district=" + district + "").pipe(
      catchError(this.handleError)
    );
  }

  gettotal() {
    return this.http.get(environment.api_url + "/api/getTotalData").pipe(
      catchError(this.handleError)
    );
  }

  getmfdata() {
    return this.http.get(environment.api_url + "/api/getamfdata").pipe(
      catchError(this.handleError)
    );
  }

  getEachStateTop5Courses(scheme: string) {
    return this.http.get(environment.api_url + "/api/getEachStateCourses?scheme=" + scheme).pipe(
      catchError(this.handleError)
    );
  }

  getStates() {
    return this.http.get(environment.api_url + "/api/getState").pipe(
      catchError(this.handleError)
    );
  }

  getCities(stateId: string) {
    return this.http.get(environment.api_url + "/api/getDistict?state=" + stateId).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      //console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened. Please try again later.');
  }
}
