import { Component, OnInit, ElementRef } from "@angular/core";
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map.js';
import View from 'ol/View';
import { BaseLayerOptions, GroupLayerOptions } from 'ol-layerswitcher';
import Overlay from 'ol/Overlay';
import ImageWMS from 'ol/source/ImageWMS';
import { transformExtent, fromLonLat } from 'ol/proj';
import XYZ from 'ol/source/XYZ';
import { Image as ImageLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from "ol/source";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import {
  ScaleLine
} from 'ol/control.js';
import LayerGroup from "ol/layer/Group";
import { MapService } from "src/app/services/map.service";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";

declare let $: any;
declare const ol: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [
    './dashboard.component.scss',

  ]
})
export class DashboardComponent implements OnInit {

  data: any
  view: View;
  baseurl: any;
  base_India_url: any;
  latitude = 20.9880135;
  longitude = 82.7525294;
  osmRoadsInBD: any;
  wmsLayer: any;
  wmsSource: any;
  wmsBuildingLayer: any;
  overlayGroupOSM: any;
  overlayGroupApplication: any;
  overviewMapControl: any;
  pageLength: Number;
  searchData: any;
  alldistict: any;
  getVectorLayer: any;
  iconFeature: any;
  assessedCandidates: any;
  ongoingCandidates: any;
  enrolledCandidates: any;
  trainedCandidates: any;
  placedCandidates: any;
  highlightOverlay: any;
  candidatepassed: any;
  candidatecertified: any;
  candidatePlacementPercentage: any;
  public stateNull = "";
  private map: any;
  public getStateValue = 'all';
  public getSchemeValue = '0';
  public getDistrictValue = 'all';
  public getTrainingTypeValue = 'allschemes';
  private districtWMSLayer;
  private stateWMSLayer;
  public selStateDistrictName = "India";
  public isSelected ="all";
  private _methodAPI = 'indiactrainingtype';
  stateDataList: any = [{ value: 'all', label : 'All State/UT' }, { value: 'Andhra Pradesh', label : 'Andhra Pradesh',isSelected: '' }, { value: 'Arunachal Pradesh', label : 'Arunachal Pradesh',isSelected: '' }, { value: 'Assam', label : 'Assam',isSelected: '' }, { value: 'Bihar', label : 'Bihar',isSelected: '' }, { value: 'Chhattisgarh', label : 'Chhattisgarh',isSelected: '' }, { value: 'Goa', label : 'Goa',isSelected: '' }, { value: 'Gujarat', label : 'Gujarat',isSelected: '' }, { value: 'Haryana', label : 'Haryana',isSelected: '' }, { value: 'Himachal Pradesh', label : 'Himachal Pradesh',isSelected: '' }, { value: 'Jharkhand', label : 'Jharkhand',isSelected: '' }, { value: 'Karnataka', label : 'Karnataka',isSelected: '' }, { value: 'Kerala', label : 'Kerala',isSelected: '' }, { value: 'Madhya Pradesh', label : 'Madhya Pradesh',isSelected: '' }, { value: 'Maharashtra', label : 'Maharashtra',isSelected: '' }, { value: 'Manipur', label : 'Manipur',isSelected: '' }, { value: 'Meghalaya', label : 'Meghalaya',isSelected: '' }, { value: 'Mizoram', label : 'Mizoram',isSelected: '' }, { value: 'Nagaland', label : 'Nagaland',isSelected: '' }, { value: 'Odisha', label : 'Odisha',isSelected: '' }, { value: 'Punjab', label : 'Punjab',isSelected: '' }, { value: 'Rajasthan', label : 'Rajasthan',isSelected: '' }, { value: 'Sikkim', label : 'Sikkim',isSelected: '' }, { value: 'Tamil Nadu', label : 'Tamil Nadu',isSelected: '' }, { value: 'Telangana', label : 'Telangana',isSelected: '' }, { value: 'Tripura', label : 'Tripura',isSelected: '' }, { value: 'Uttar Pradesh', label : 'Uttar Pradesh',isSelected: '' }, { value: 'Uttarakhand', label : 'Uttarakhand',isSelected: '' }, { value: 'West Bengal', label : 'West Bengal',isSelected: '' }, { value: 'Andaman and Nicobar Islands', label : 'Andaman and Nicobar Islands',isSelected: '' }, { value: 'Chandigarh', label : 'Chandigarh',isSelected: '' }, { value: 'The Dadra And Nagar Haveli And Daman And Diu', label : 'The Dadra And Nagar Haveli And Daman And Diu',isSelected: '' }, { value: 'Delhi', label : 'Delhi',isSelected: '' }, { value: 'Jammu and Kashmir', label : 'Jammu And Kashmir',isSelected: '' }, { value: 'Lakshadweep', label : 'Lakshadweep',isSelected: '' }, { value: 'Puducherry', label : 'Puducherry',isSelected: '' }, { value: 'Ladakh', label : 'Ladakh',isSelected: '' }];
  constructor(
    private el: ElementRef,
    private service: MapService

  ) {
    this.base_India_url = 'https://dev-gis-mapserver.nsdcindia.co/geoserver/SIM/wms'; // geoserver_map
  }


  ngOnInit(): void {
    this.isSelected ="all";
    this.scaleControl();
    this.loadView();
    this.loadMap();
    this.loadPMKVYData('all', 'all', '0', 'allschemes');
    this.highlightOverlay = new VectorLayer({
      style: new Style({
        stroke: new Stroke({
          color: 'white',
          width: 1.5,
        }),
        fill: new Fill({
          color: 'rgb(255,102,41,.4)',
        }),
      }),//(customize your highlight style here),
      source: new VectorSource(),
      map: this.map
    });
  }
  setSelectedLabelMap(state_dist){
    if(state_dist == 'all'){
      this.selStateDistrictName = 'India';
      this.isSelected = 'all';
    }else{
      this.selStateDistrictName = state_dist;
      
    }
    
  }
  onChangeState(state) {
    this.highlightOverlay.getSource().clear();
    this.setSelectedLabelMap(state)
    this.isSelected = state;
    this.getStateValue = state; //this wont work
    this.getDistrictValue = 'all'; //this wont work
    if (this.getStateValue == undefined) {
      this.getStateValue = "all";
    }
   
    this._methodAPI = "indiacstatetrainingtype";
    //zoom to selected state
    this.vectorSource.getFeatures().forEach((feature, ind) => {
      if (feature.get('NAME').toLowerCase() === this.getStateValue.toLowerCase()) {
        this.map.getView().fit(feature.getGeometry().getExtent());

      }

    })
    if (this.getStateValue == 'all') {
      this.map.getView().fit(this.transform([68.11008984007412, 6.755697990369924, 97.40910312001301, 37.05030000014506]));
      this._methodAPI = "indiactrainingtype";
      this.highlightOverlay.getSource().clear();
    }
    let params = this.districtWMSLayer.getSource().getParams();
    params.CQL_FILTER = "state ='" + this.getStateValue + "'";
    this.districtWMSLayer.getSource().updateParams(params);
    this.loadPMKVYData(this.getStateValue, this.getDistrictValue, this.getSchemeValue, this.getTrainingTypeValue);
  }

  onChangePmkvy(event: Event) {
    ;
    this.getSchemeValue = (event.target as HTMLInputElement).getAttribute('dataname'); //this wont work
    if (this.getSchemeValue == undefined) {
      this.getSchemeValue = "0";
    }
    $(".pmkvy-filter-data a").removeClass("active");
    $('.pmkvy-filter-data a[dataname="' + this.getSchemeValue + '"]').addClass(
      "active"
    );
    this.loadPMKVYData(this.getStateValue, this.getDistrictValue, this.getSchemeValue, this.getTrainingTypeValue);

  }

  onChangeScheme(event: Event) {
    ;
    this.getTrainingTypeValue = (event.target as HTMLInputElement).getAttribute('dataname'); //this wont work

    $(".sorting-tabs a").removeClass("active");
    $('.sorting-tabs a[dataname="' + this.getTrainingTypeValue + '"]').addClass(
      "active"
    );
    if (this.getTrainingTypeValue == undefined) {
      this.getTrainingTypeValue = "allschemes";
    }

    this.loadPMKVYData(this.getStateValue, this.getDistrictValue, this.getSchemeValue, this.getTrainingTypeValue);

  }

  transform(extent) {
    return transformExtent(extent, 'EPSG:4326', 'EPSG:3857');
  }

  loadView = () => {
    this.view = new View({
      center: fromLonLat([this.longitude, this.latitude]),
      zoom: 4,
      maxZoom: 18,
      minZoom: 3,
      extent: this.transform([68.11008984007412, 6.755697990369924, 97.40910312001301, 37.05030000014506]),
      constrainOnlyCenter: true
    });
  };

  scaleControl(): ScaleLine {
    return new ScaleLine({
      units: 'metric',
      bar: true,
      steps: 4,
      text: true,
      minWidth: 100
    });
  }

  loadBaseLayer = () => {

    const baseLayers = new LayerGroup({
      title: 'Base Layers',
      openInLayerSwitcher: true,
      layers: [
        new TileLayer({
          title: 'OSM',
          baseLayer: true,
          source: new OSM(),
          type: 'base',
          visible: false
        } as BaseLayerOptions),
        new TileLayer({
          title: 'Street Map',
          baseLayer: true,
          type: 'base',
          visible: false,
          source: new XYZ({
            url: 'http://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
            crossOrigin: 'anonymous'
          })
        } as BaseLayerOptions),
        new TileLayer({
          title: 'Terrain Image',
          baseLayer: true,
          visible: false,
          type: 'base',
          source: new XYZ({
            url: 'http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}',
            crossOrigin: 'anonymous'
          })
        } as BaseLayerOptions),
        new TileLayer({
          title: 'Satellite Map',
          baseLayer: true,
          visible: false,
          type: 'base',
          source: new XYZ({
            url: 'http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}',
            crossOrigin: 'anonymous'
          })
        } as BaseLayerOptions),
        new TileLayer({
          title: 'Hybrid',
          baseLayer: true,
          type: 'base',
          visible: true,
          source: new XYZ({
            url: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}',
            crossOrigin: 'anonymous'
          })
        } as BaseLayerOptions)
      ]
    } as GroupLayerOptions);

    return baseLayers;
  };

  loadOverLay = () => {
    const container = document.getElementById('popup');
    const overlay = new Overlay({
      element: container,
      autoPan: {
        animation: {
          duration: 250
        }
      }
    });

    return overlay;
  };
  private vectorSource = new VectorSource({
    url: 'https://dev-gis-mapserver.nsdcindia.co/geoserver/SIM/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SIM%3AState&maxFeatures=50&outputFormat=application%2Fjson',
    format: new GeoJSON(),

  });

  loadDistrictWMSLayer = () => {
    this.districtWMSLayer = new ImageLayer({
      title: 'District',
      Id: 'District',
      visible: true,
      source: new ImageWMS({
        url: this.base_India_url,
        params: { LAYERS: 'SIM:District1', tiled: true },
        serverType: 'geoserver',
        ratio: 1,
        crossOrigin: 'anonymous'
      })
    } as BaseLayerOptions)
    return this.districtWMSLayer;
  }

  loadStateWMSLayer = () => {
    this.stateWMSLayer = new ImageLayer({
      title: 'State',
      Id: 'State',
      visible: true,
      source: new ImageWMS({
        url: this.base_India_url,
        params: { LAYERS: 'SIM:State', tiled: true },
        //params: { LAYERS: 'SIM:State'},
        serverType: 'geoserver',
        ratio: 1,
        crossOrigin: 'anonymous'
      })
    } as BaseLayerOptions)
    return this.stateWMSLayer;
  }

  loadMap = () => {
    let stateBlank = "";
    this.map = new Map({
      target: 'map',
      //controls: defaultControls({ attribution: false, zoom: false,rotate:false }),
      controls: [],
      interactions: [],
      view: this.view,
      overlays: [this.loadOverLay()],
      layers: [
        this.loadBaseLayer(),
        this.loadStateWMSLayer(),
        this.loadDistrictWMSLayer(),
      ]
    });
    this.getVectorLayer = new VectorLayer({
      source: this.vectorSource,
      style: new Style({
        stroke: new Stroke({
          color: 'white',
          width: 1.5,
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.1)',
        }),
      }),
    });


    this.map.addLayer(this.getVectorLayer);
    var parser = new ol.format.WMSGetFeatureInfo();
    const _that = this;
    this.map.on('click', function (evt) {
      _that.highlightOverlay.getSource().clear();
      let _state = "all", _district = 'all';
      this.forEachLayerAtPixel(evt.pixel, function (layer) {
        try {
          if (layer.get('Id') == 'District' || layer.get('Id') == 'State') {
            let title = layer.get('Id');
            let viewResolution = _that.map.getView().getResolution();
            let url = layer.getSource().getFeatureInfoUrl(
              evt.coordinate,
              viewResolution,
              _that.map.getView().getProjection(),
              { INFO_FORMAT: 'application/json' }
            );
            if (url) {
              fetch(url)
                .then(function (response) {
                  return response.text();
                })
                .then(function (html) {
                  let tabledata = new Function('return [' + html + ']')();
                  if (title == 'District' && tabledata[0].features.length > 0) {
                    _that._methodAPI = 'indiacstatedistricttrainingtype';
                    _state = tabledata[0].features[0].properties.state;
                    _district = tabledata[0].features[0].properties.dist_code;
                    _that.setSelectedLabelMap(tabledata[0].features[0].properties.district);
                    _that.getDistrictValue = _district;
                    _that.getStateValue = _state;
                    _that.loadPMKVYData(_state, _district, _that.getSchemeValue, _that.getTrainingTypeValue);
                    var url = _that.districtWMSLayer.getSource().getFeatureInfoUrl(evt.coordinate,
                      _that.view.getResolution(), _that.view.getProjection(),
                      { 'INFO_FORMAT': 'application/vnd.ogc.gml' });
                    fetch(url)
                      .then(function (response) {
                        return response.text();
                      }).then(function (response) {
                        var features = parser.readFeatures(response);
                        _that.highlightOverlay.getSource().clear();
                        _that.highlightOverlay.getSource().addFeatures(features);
                      });
                  } else
                    if (title == 'State' && _district == 'all' && tabledata[0].features.length > 0) {
                      _that._methodAPI = 'indiacstatetrainingtype';
                      _state = tabledata[0].features[0].properties.NAME;
                      
                      _that.onChangeState(_state) 
                      _that.getStateValue = _state;
                      _that.loadPMKVYData(_state, 'all', _that.getSchemeValue, _that.getTrainingTypeValue);
                      const feature = _that.map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
                        _that.map.getView().fit(feature.getGeometry().getExtent());
                        return feature;
                      });
                      let paramsDistrict = _that.districtWMSLayer.getSource().getParams();
                      paramsDistrict.CQL_FILTER = "state ='" + _that.getStateValue + "'";
                      _that.districtWMSLayer.getSource().updateParams(paramsDistrict);

                    }
                });
            }
          }
        } catch (e) {
          
        }
      });
    });

    this.map.on('pointermove', function (evt) {
      const feature = _that.map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
          return feature;
      });
      _that.map.getTargetElement().style.cursor = feature ? 'pointer' : '';
    });
  };

  loadPMKVYData = (state, district, scheme, trainingtype) => {
    const PMKVYData = this.service.getPMKVYData(state, district, scheme, trainingtype, this._methodAPI).subscribe(Response => {
      this.data = Response;
      this.assessedCandidates = this.data.candidateassessed;
      this.ongoingCandidates = this.data.ongoingcandidates;
      this.enrolledCandidates = this.data.enrolledcandidates;
      this.trainedCandidates = this.data.trainedcandidates;
      this.placedCandidates = this.data.placedcandidate; 
      this.candidatecertified = this.data.candidatecertified;

      let number1 = this.data.placedcandidate;
      let number2 = this.data.candidatecertified;
      let percentage = ((number1 / number2) * 100).toFixed(2);
      if (number1 == "0" || number2 == "0") {
        this.candidatePlacementPercentage = "0";
      } else {
        this.candidatePlacementPercentage = percentage + "%";
      }
    });
    return PMKVYData;
  }
}
