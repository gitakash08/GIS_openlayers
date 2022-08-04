import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { transformExtent } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map.js';
import { Icon } from 'ol/style';
import View from 'ol/View';
import LayerGroup from 'ol/layer/Group';
import Feature from 'ol/Feature';
import LayerSwitcher from 'ol-layerswitcher';
import Point from 'ol/geom/Point';
import { BaseLayerOptions, GroupLayerOptions } from 'ol-layerswitcher';
import Overlay from 'ol/Overlay';
import ImageWMS from 'ol/source/ImageWMS';
import Group from 'ol/layer/Group';
import XYZ from 'ol/source/XYZ';
import { Image as ImageLayer } from 'ol/layer';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from "ol/style";
import { Cluster, OSM, Vector as VectorSource } from "ol/source";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import {
  defaults as defaultControls,
  ScaleLine,
  FullScreen,
  OverviewMap
} from 'ol/control.js';
import {
  getHeight,
  getWidth,
  extend,
  createEmpty
} from "ol/extent";

import { MapService } from '../../services/map.service';
import { InfoToolModalComponent } from '../info-tool-modal/info-tool-modal.component';

declare let $: any;
declare const ol: any;

@Component({
  selector: 'app-skill-india-map',
  templateUrl: './skill-india-map.component.html',
  styleUrls: ['./skill-india-map.component.scss']
})
export class SkillIndiaMapComponent implements OnInit {
  _dialogRef: MatDialogRef<InfoToolModalComponent>;
  view: View;
  baseUrlSIMLayers: any;
  india_centre_lat = 20.988035;
  india_centre_lng = 82.7525294;
  overviewMapControl: any;
  searchPlaceControl: any;
  searchPlaceVecLayer: any;
  searchPlaceFeature: any;
  map: any;
  constructor(
    private mapservice: MapService,
    private dialog: MatDialog
  ) {
    this.baseUrlSIMLayers = 'https://dev-gis-mapserver.nsdcindia.co/geoserver/SIM/wms'; // geoserver_map
  }

  scaleControl(): ScaleLine {
    return new ScaleLine({
      units: 'metric',
      bar: true,
      steps: 4,
      text: true,
      minWidth: 100
    });
  }
  selectEvent(event) {
    this.ngOnInit(event.NAME.toString());
  }
  ngOnInit(search = ''): void {
    let canvaswidth = $('#map').parent().css('width');
    let zoomLevel = 5;
    if (parseInt(canvaswidth.replace('px', '')) > 700 && parseInt(canvaswidth.replace('px', '')) < 1370) {
      zoomLevel = 4;
    }
    else if (parseInt(canvaswidth.replace('px', '')) < 700) {
      zoomLevel = 4;
    }
    else {
      zoomLevel = 5;
    }

    this.loadView(zoomLevel);
    this.loadOverViewMapControl();
    this.scaleControl();
    this.loadMap();
    this.loadInfoTool(this.map);
    this.map.addControl(this.loadSearch());
    this.map.addControl(this.loadLayerSwitcher());
    this.zoomToIndiaExtent(this.map);
  }

  zoomToIndiaExtent = (map) => {
    map.getView().fit(this.transform([68.11008984007412, 6.755697990369924, 97.40910312001301, 37.05030000014506]),);
  }
  transform(extent) {
    return transformExtent(extent, 'EPSG:4326', 'EPSG:3857');
  }
  loadView = (zoom12) => {
    this.view = new View({
      maxZoom: 18,
      minZoom: 4,
      extent: this.transform([68.11008984007412, 6.755697990369924, 97.40910312001301, 37.05030000014506]),
      constrainOnlyCenter: true
    });
  };
  loadOverViewMapControl = () => {
    this.overviewMapControl = new OverviewMap({
      collapseLabel: '\u00BB',
      label: '\u00AB',
      collapsed: true
    });
  };
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
          visible: true,
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
          type: 'base',
          visible: false,
          source: new XYZ({
            url: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}',
            crossOrigin: 'anonymous'
          })
        } as BaseLayerOptions)
      ]
    } as GroupLayerOptions);

    return baseLayers;
  };
  loadSourceMeasure = () => {
    const sourceMeasure = new VectorLayer({
      crossOrigin: 'anonymous'
    } as BaseLayerOptions);
    return sourceMeasure;
  };
  loadVectorMeasure = () => {
    const vectorMeasure = new VectorLayer({
      source: this.loadSourceMeasure(),
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new Stroke({
          color: '#df1c29',
          width: 2
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: '#df1c29'
          })
        })
      }),
      title: 'Measure Overlay'
    } as BaseLayerOptions);

    return vectorMeasure;
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
  loadClusterLayer = () => {
    const sourceData = new VectorSource({
      format: new GeoJSON(),
      url:
        "https://dev-gis-mapserver.nsdcindia.co/geoserver/SIM/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SIM%3ASIP_TP&outputFormat=application%2Fjson"

    });
    const clusterSource = new Cluster({
      distance: 40,
      minDistance: 5,
      source: sourceData,

    });
    const lightIcon = new Icon({
      src:
        "assets/img/SIP_1.0.svg",

    });
    lightIcon.setScale(.4)

    const styleCache = {};
    const clusters = new VectorLayer({
      title: 'PMKK TC',
      Id: 'PMKK_TC',
      visible: true,
      source: clusterSource,
      style: function (feature, resolution) {
        const size = feature.get("features").length;
        let style = styleCache[size];
        if (size > 1) {
          const originalFeatures = feature.get("features");
          const extent = createEmpty();
          let j, jj;
          for (j = 0, jj = originalFeatures.length; j < jj; ++j) {
            extend(extent, originalFeatures[j].getGeometry().getExtent());
          }
          let radius = (0.15 * (getWidth(extent) + getHeight(extent))) / resolution;
          if (radius < 10) {
            radius = 10;
          }
          if (!style) {
            style = new Style({
              image: new CircleStyle({
                radius: radius, /// 100 > 40 ? 40 : radius / 100 < 10 ? 10 : radius / 100,
                stroke: new Stroke({
                  color: "#fff"
                }),
                fill: new Fill({
                  color: "#3399CC"
                })
              }),
              text: new Text({
                text: size.toString(),
                fill: new Fill({
                  color: "#fff"
                })
              })
            });
            styleCache[size] = style;
          }
        } else {
          style = new Style({
            image: lightIcon,

          });
        }
        return style;
      }

    } as BaseLayerOptions);
    return clusters;
  };

  loadMap = () => {
    this.map = new Map({
      target: 'map',
      controls: defaultControls({ attribution: true, zoom: true }).extend([
        new ScaleLine(),
        new FullScreen(),
        this.scaleControl()
      ]),
      view: this.view,

      overlays: [this.loadOverLay()],
      layers: [
        this.loadBaseLayer(),
        new Group({
          title: 'Admin Boundary',
          openInLayerSwitcher: true,
          layers: [
            new ImageLayer({
              title: 'India',
              Id: 'India',
              visible: true,
              source: new ImageWMS({
                url: 'https://dev-gis-mapserver.nsdcindia.co/geoserver/SIM_DISTRICT/wms',
                params: { 'LAYERS': 'SIM_DISTRICT:World_India', tiled: true },
                serverType: 'geoserver',
                ratio: 1,
                crossOrigin: "anonymous"
              })
            } as BaseLayerOptions),

            new ImageLayer({
              title: 'State',
              Id: 'State',
              visible: true,
              source: new ImageWMS({
                url: this.baseUrlSIMLayers,
                params: { LAYERS: 'SIM:State', tiled: true },
                serverType: 'geoserver',
                ratio: 1,
                crossOrigin: 'anonymous'
              })
            } as BaseLayerOptions),
            new ImageLayer({
              title: 'District',
              Id: 'District',
              visible: false,
              source: new ImageWMS({
                url: this.baseUrlSIMLayers,
                params: { LAYERS: 'SIM:District', tiled: true },
                serverType: 'geoserver',
                ratio: 1,
                crossOrigin: 'anonymous'
              })
            } as BaseLayerOptions),

          ]
        } as GroupLayerOptions),

        new Group({
          title: 'Center',
          openInLayerSwitcher: true,
          layers: [
            new ImageLayer({
              title: 'ITI',
              Id: 'ITI Center',
              visible: false,
              source: new ImageWMS({
                url: this.baseUrlSIMLayers,
                params: { LAYERS: 'SIM:ITI_TC', tiled: true },
                serverType: 'geoserver',
                ratio: 1,
                crossOrigin: 'anonymous'
              })
            } as BaseLayerOptions),
            new ImageLayer({
              title: 'JSS',
              Id: 'JSS Center',
              visible: false,
              source: new ImageWMS({
                url: this.baseUrlSIMLayers,
                params: { LAYERS: 'SIM:JSS_TP', tiled: true },
                serverType: 'geoserver',
                ratio: 1,
                crossOrigin: 'anonymous'
              })
            } as BaseLayerOptions),
            new ImageLayer({
              title: 'PMKK',
              Id: 'PMKK Center',
              visible: false,
              source: new ImageWMS({
                url: this.baseUrlSIMLayers,
                params: { LAYERS: 'SIM:SIP_TP', tiled: true },
                serverType: 'geoserver',
                ratio: 1,
                crossOrigin: 'anonymous'
              })
            } as BaseLayerOptions)
          ]
        } as GroupLayerOptions),

        new Group({
          title: 'Candidate',
          openInLayerSwitcher: true,
          layers: [
            new ImageLayer({
              title: 'ITI',
              Id: 'ITI Candidate',
              visible: false,
              source: new ImageWMS({
                url: this.baseUrlSIMLayers,
                params: { LAYERS: 'SIM:ITI_Trainee', tiled: true },
                serverType: 'geoserver',
                ratio: 1,
                crossOrigin: 'anonymous'
              })
            } as BaseLayerOptions),
            new ImageLayer({
              title: 'PMKK',
              Id: 'PMKK Candidate',
              visible: false,
              source: new ImageWMS({
                url: this.baseUrlSIMLayers,
                params: { LAYERS: 'SIM:SIP_Trainee', tiled: true },
                serverType: 'geoserver',
                ratio: 1,
                crossOrigin: 'anonymous'
              })
            } as BaseLayerOptions)
          ]
        } as GroupLayerOptions)
      ]
    });

  };
  loadSearch = () => {
    const _that = this;

    let vectorSource = new VectorSource({});
    this.searchPlaceVecLayer = new VectorLayer({
      source: vectorSource
    });
    this.map.addLayer(this.searchPlaceVecLayer);
    let placeSearchPosData = [];
    this.mapservice.getDistrict().subscribe((data_json) => {
      data_json.features.forEach((itm, ind) => {
        placeSearchPosData.push({
          name: itm.properties.NAME,
          pos: ol.proj.transform(
            itm.geometry.coordinates,
            'EPSG:4326',
            'EPSG:3857'
          ),
          zoom: 23
        });
      });

    });

    this.searchPlaceControl = new ol.control.Search({

      getTitle: function (f) {
        return f.name;
      },
      reverse: false,
      position: true,
      placeholder: 'Place Name',
      autocomplete: function (s, cback) {
        let result = [];
        let rex = new RegExp(s.replace('*', '') || '.*', 'i');
        for (let i = 0; i < placeSearchPosData.length; i++) {
          if (rex.test(placeSearchPosData[i].name)) result.push(placeSearchPosData[i]);
        }
        return result.sort().reverse();
      }
    });
    this.searchPlaceControl.clearHistory();
    this.searchPlaceControl.on('select', function (evt) {

      _that.searchPlaceControl.clearHistory();
      let search = this.element.querySelector("input.search");
      
      _that.map.getView().animate({
        center: evt.search.pos,
        zoom: 12,
        easing: ol.easing.easeOut
      });
      this.iconFeature = new Feature({
        geometry: new Point(evt.search.pos),
        name: evt.search.name,
        population: 4000,
        rainfall: 500
      });

      let iconStyle = new Style({
        image: new Icon({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          opacity: 1,
          scale: .07,
          src: 'assets/img/Place_Holder-SIM.png'
        }),
        text: new ol.style.Text({
          text: evt.search.name,
          scale: 1.5,
          offsetX: 20,
          placement: 'point',
          textAlign: 'top',
          fill: new ol.style.Fill({ color: '#000' }),
          backgroundFill: new ol.style.Fill({ color: '#FFC23C' }),
          padding: [7, 7, 7, 7]
        })
      });

      this.iconFeature.setStyle(iconStyle);
      // End cursor Set
      search.value = evt.search.name;
      let len = search.value.length;
      if (search.setSelectionRange) {
        search.focus();
        search.setSelectionRange(len, len);
      } else if (search.createTextRange) {
        let t = search.createTextRange();
        t.collapse(true);
        t.moveEnd('character', len);
        t.moveStart('character', len);
        t.select();
      }
      
      let features = [];
      features.push(this.iconFeature);
      vectorSource.clear();
      vectorSource.addFeatures(features);
    });
    return this.searchPlaceControl;
  };
  loadLayerSwitcher = () => {
    const layerSwitcher = new LayerSwitcher({
      reverse: true,
      groupSelectStyle: 'group', activationMode: 'click', tipLabel: 'Layerlist'
    });
    return layerSwitcher;
  };
  openInfoTool = (tabledata, title) => {
    this._dialogRef = this.dialog.open(InfoToolModalComponent, {
      ariaDescribedBy: 'sectorDialogBox',
      width: '450px',
      data: { tabledata: tabledata, title: title }
    });
  }
  loadInfoTool = (map) => {
    const _that = this;
    map.getLayers().getArray().forEach(function (l) {
      if (l.get('title') != 'Base Layers' && l.get('title') != undefined) {
        l.getLayers().forEach(function (layer) {
          if (layer)
            _that.listenVisible(layer, l);
        });
      }
    });
    map.on('click', function (evt) {
      const btnHideShow = document.getElementById('btnHideShow');
      btnHideShow.style.display = 'none';
      $(".layer-switcher-activation-mode-click").removeClass("shown");
      $(".layer-switcher-activation-mode-click button").html("");
      let showInfo = false;
      this.forEachLayerAtPixel(evt.pixel, function (layer) {
        try {
          if (
            layer.get('Id') === 'ITI Center' ||
            layer.get('Id') === 'JSS Center' ||
            layer.get('Id') === 'PMKK Center'
            // layer.get('Id') === 'ITI Candidate' ||
            //layer.get('Id') === 'PMKK Candidate'
          ) {
            showInfo = true;
            let title = layer.get('Id');
            let viewResolution = map.getView().getResolution();
            let url = layer.getSource().getFeatureInfoUrl(
              evt.coordinate,
              viewResolution,
              map.getView().getProjection(),
              { INFO_FORMAT: 'application/json', FEATURE_COUNT: 50 }
            );
            if (url) {
              fetch(url)
                .then(function (response) {
                  return response.text();
                })
                .then(function (html) {
                  let tabledata = new Function('return [' + html + ']')();
                  if (showInfo) {
                    if (tabledata[0].features.length > 0) {
                      _that.openInfoTool(tabledata, title);
                      showInfo = false;
                    }
                  }
                });
            } else {
            }
          } else {
          }
        } catch (e) {
          //  console.log(e);
        }
      });
    });

    map.on("pointermove", function (evt) {
      const _that = this;
      this.forEachLayerAtPixel(evt.pixel, function (layer) {
        try {
          if (
            layer.get('Id') === 'ITI Center' ||
            layer.get('Id') === 'JSS Center' ||
            layer.get('Id') === 'PMKK Center'
          ) {
            let title = layer.get('Id');
            let viewResolution = map.getView().getResolution();
            let url = layer.getSource().getFeatureInfoUrl(
              //text/html
              evt.coordinate,
              viewResolution,
              map.getView().getProjection(),
              { INFO_FORMAT: 'application/json', FEATURE_COUNT: 50 }
            );
            if (url) {
              fetch(url)
                .then(function (response) {
                  return response.text();
                })
                .then(function (html) {
                  let tabledata = new Function('return [' + html + ']')();
                  if (tabledata[0].features.length > 0) {
                    _that.getTargetElement().style.cursor = 'pointer';
                  } else {
                    _that.getTargetElement().style.cursor = '';
                  }

                });
            } else {
              _that.getTargetElement().style.cursor = '';
            }
          }
          else {
            _that.getTargetElement().style.cursor = '';
          }
        }
        catch (e) {
          _that.getTargetElement().style.cursor = '';
        }
      });
    });
  };
  show() {
    const btnHideShow = document.getElementById('btnHideShow');
    if (btnHideShow.style.display === 'none') {
      btnHideShow.style.display = 'block';
    } else {
      btnHideShow.style.display = 'none';
    }
  }
  listenVisible(layer, group) {
    layer.on('change:visible', function (e) {
      console.log(layer.get('visible'))
      // LayerGroup
      if (layer.getLayers) {
        var vis = layer.getVisible();
        layer.getLayers().forEach(function (l) {
          if (l.getVisible() !== vis) {
            // Prevent inifnite loop
            l.set('visible', vis, true);
          }
        });
      }
      // if inside a group, check visibility of layers in it
      if (group) {
        let vis = false;
        group.getLayers().forEach(function (l) {
          if (l.getVisible()) vis = true;
        });
        if (group.getVisible() !== vis) group.setVisible(vis);
      }
    });
    // Listen to layers in it
    if (layer.getLayers) {
      layer.getLayers().forEach(function (l) {
        this.listenVisible(l, layer);
      });
    }
  }
}

