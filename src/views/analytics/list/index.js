// ** React Imports
import { React, useState } from 'react'
// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

// ** Custom Components
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
import IndicatorFilter from './indicatorFilter'


// ** Icons Imports
import { User, UserPlus, UserCheck, UserX } from 'react-feather'

import Highcharts from 'highcharts'
import drilldown from 'highcharts/modules/drilldown'
import HighchartsReact from 'highcharts-react-official'

drilldown(Highcharts)

// ** Styles
import '@styles/react/apps/app-users.scss'

const UsersList = () => {
  const [sidebarOpen] = useState(false)


  // Create the chart
const txCURRData = {
  chart: {
      type: 'column'
  },
  title: {
      align: 'left',
      text: 'Patients Currently Receiving ART by location'
  },
  subtitle: {
      align: 'left',
      text: 'Click the columns drill down'
  },
  accessibility: {
      announceNewData: {
          enabled: true
      }
  },
  xAxis: {
      type: 'category'
  },
  yAxis: {
      title: {
          text: 'Number of patients'
      }

  },
  legend: {
      enabled: false
  },
  colors: [
    '#536e27 ',
    '#536e27 '
],
  plotOptions: {
      series: {
          borderWidth: 0,
          dataLabels: {
              enabled: true,
              format: '{point.y}'
          }
      }
  },

  tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> of total<br/>'
  },

  series: [
      {
          name: "Browsers",
          colorByPoint: true,
          data:[
            {
              name: "Rivers",
              y: 182274,
              drilldown: "Rivers"
            },
            {
              name: "FCT",
              y: 86404,
              drilldown: "FCT"
            },
            {
              name: "Nasarawa",
              y: 75804,
              drilldown: "Nasarawa"
            },
            {
              name: "Katsina",
              y: 14399,
              drilldown: "Katsina"
            }
          ]          
      }
  ],
  drilldown: {
      breadcrumbs: {
          position: {
              align: 'right'
          }
      },
      series: [
        {
          name: "Obio/Akpor",
          id: "Obio/Akpor",
          data: [
            [
              "Initiative for Advancement of Humanity (IAH)",
              20543
            ],
            [
              "KPIF Obio-Akpor KP OSS",
              18205
            ],
            [
              "University of Portharcourt Teaching Hospital",
              5654
            ],
            [
              "Rumuokrushi Model Primary Health Centre",
              1665
            ],
            [
              "Obio Cottage Hospital",
              1066
            ],
            [
              "Ozuoba Model Primary Health Centre",
              905
            ],
            [
              "Rumuodomaya Model Primary Health Centre",
              894
            ],
            [
              "Rumuigbo Model Primary Health Centre",
              676
            ],
            [
              "Iriebe Primary Health Centre",
              551
            ],
            [
              "Eneka Model Primary Health Centre",
              530
            ],
            [
              "Rumuepirikom Model Primary Health Centre",
              463
            ],
            [
              "College of Health Technology Clinic",
              422
            ],
            [
              "Elelenwo FSP Health Centre",
              384
            ],
            [
              "Rumueme Model Primary Health Centre",
              355
            ],
            [
              "Eliozu Model Primary Health Centre",
              262
            ],
            [
              "Rumuolumeni Model Primary Health Centre",
              249
            ],
            [
              "St. Martin's Hospital",
              206
            ],
            [
              "April Clinic",
              127
            ],
            [
              "Rivon Clnic",
              99
            ],
            [
              "Pathfare Clinic",
              85
            ],
            [
              "Karpearl Hospital",
              84
            ],
            [
              "Sonabel Medical Centre & Hospital",
              84
            ],
            [
              "Alphonso Hospital",
              63
            ],
            [
              "Palmers Hospital Ltd",
              55
            ],
            [
              "Woji Cottage Hospital",
              47
            ],
            [
              "Spring Hospital",
              43
            ],
            [
              "Kendox Medical Services",
              27
            ],
            [
              "Splendour Hospital Ltd",
              27
            ],
            [
              "Atinu Critical Care Hospital",
              11
            ]
          ]
        },
        {
          name: "Khana",
          id: "Khana",
          data: [
            [
              "Bori General Hospital",
              7447
            ],
            [
              "Pope John Paul Clinic",
              6039
            ],
            [
              "Opuoko Model Primary Health Centre",
              2532
            ],
            [
              "Bori Inadum Medical Centre",
              2378
            ],
            [
              "Beeri Model Primary Health Centre",
              2263
            ]
          ]
        },
        {
          name: "port harcourt",
          id: "port harcourt",
          data: [
            [
              "Rivers State University Teaching Hospital",
              4666
            ],
            [
              "Health of the Sick",
              3708
            ],
            [
              "Churchill Model Primary Health Centre",
              1279
            ],
            [
              "Resource Centre",
              896
            ],
            [
              "Mgbundukwu (Okija) Model Primary Health Centre",
              496
            ],
            [
              "Meridian Hospital",
              381
            ],
            [
              "Orogbum Primary Health Centre",
              349
            ],
            [
              "Okuru-ama Model Primary Health Centre",
              338
            ],
            [
              "New Mile one Hospital",
              297
            ],
            [
              "Ozuboko Model Primary Health Centre",
              293
            ],
            [
              "Elekahia Model Primary Health Centre",
              233
            ],
            [
              "Potts Johnson Model Primary Health Centre",
              223
            ],
            [
              "Bunduama Model Primary Health Centre",
              208
            ],
            [
              "Police Medical Clinic",
              195
            ],
            [
              "Sterling Specialist Hospital",
              60
            ],
            [
              "Megacare Hospital",
              36
            ],
            [
              "St Patricks Hospital",
              32
            ],
            [
              "Hearth Health Hospital",
              26
            ]
          ]
        },
        {
          name: "Gokana",
          id: "Gokana",
          data: [
            [
              "Terrebor General Hospital",
              7924
            ],
            [
              "Bodo General Hospital",
              2820
            ],
            [
              "Kpor Model Primary Health Centre",
              790
            ],
            [
              "Bomu Model Primary Health Centre",
              647
            ],
            [
              "Dumkil Medical Centre",
              526
            ]
          ]
        },
        {
          name: "Ogba/Egbema/Ndoni",
          id: "Ogba/Egbema/Ndoni",
          data: [
            [
              "Omoku General Hospital",
              5156
            ],
            [
              "Omoku Model Primary Health Centre",
              3084
            ],
            [
              "Okwuzi Model Primary Health Centre",
              2102
            ],
            [
              "Erema General Hospital",
              2031
            ],
            [
              "Gbeye Clinic",
              225
            ],
            [
              "Omoku Prize Medicals Limited",
              55
            ]
          ]
        },
        {
          name: "Tai",
          id: "Tai",
          data: [
            [
              "Kpite Model Primary Health Centre",
              3225
            ],
            [
              "Bunu Model Primary Health Centre",
              2951
            ],
            [
              "Bangoi Primary Health Centre",
              2761
            ],
            [
              "Nonwa Model Primary Health Centre",
              2368
            ]
          ]
        },
        {
          name: "Okrika",
          id: "Okrika",
          data: [
            [
              "Okrika General Hospital",
              4603
            ],
            [
              "Ibaka Model Primary Health Centre",
              1953
            ],
            [
              "Ogoloma Model Primary Health Centre",
              1605
            ],
            [
              "Ayungu Biri Model Primary Health Centre",
              970
            ],
            [
              "Okrika Mainland Clinic",
              76
            ]
          ]
        },
        {
          name: "Ahoada East",
          id: "Ahoada East",
          data: [
            [
              "Ahoada General Hospital",
              6471
            ],
            [
              "Ula Upata Beulah Clinic",
              230
            ],
            [
              "Ahoada Model Primary Health Centre",
              165
            ],
            [
              "Ahoada Gbeye Clinic Annex",
              37
            ]
          ]
        },
        {
          name: "Degema",
          id: "Degema",
          data: [
            [
              "Degema General Hospital",
              6887
            ]
          ]
        },
        {
          name: "Etche",
          id: "Etche",
          data: [
            [
              "Okomoko General Hospital",
              4163
            ],
            [
              "Umuebule Cottage Hospital",
              1046
            ]
          ]
        },
        {
          name: "Eleme",
          id: "Eleme",
          data: [
            [
              "Agbonchia Model Primary Health Centre",
              947
            ],
            [
              "Akpajo Model Primary Health Centre",
              941
            ],
            [
              "Onne Model Primary Health Centre",
              822
            ],
            [
              "Eleme General Hospital",
              808
            ],
            [
              "Nchia Health Centre",
              656
            ],
            [
              "Ebubu Model Primary Health Centre",
              457
            ],
            [
              "Onne Medical Centre",
              86
            ],
            [
              "Vinkas Clinic",
              59
            ],
            [
              "Dorkson Medical Clinic",
              57
            ],
            [
              "Sonabel Hospital (HQ)",
              45
            ],
            [
              "Omas Medical Centre & Maternity",
              42
            ],
            [
              "Morning Star Hospital",
              30
            ],
            [
              "St Matthews Clinic",
              17
            ]
          ]
        },
        {
          name: "Oyigbo",
          id: "Oyigbo",
          data: [
            [
              "Oyigbo Comprehensive Health Centre",
              4778
            ],
            [
              "Divine Wisdom Hospital",
              46
            ],
            [
              "Living Water Hospital",
              30
            ],
            [
              "Heritage Medicare Hospital",
              24
            ]
          ]
        },
        {
          name: "Ikwerre",
          id: "Ikwerre",
          data: [
            [
              "Isiokpo General Hospital",
              3841
            ],
            [
              "Aluu Model Primary Health Centre",
              575
            ],
            [
              "Igwuruta Model Health Center",
              271
            ],
            [
              "Mbodo Aluu Primary Health Centre",
              83
            ]
          ]
        },
        {
          name: "Bonny",
          id: "Bonny",
          data: [
            [
              "Bonny KP One Stop Shop",
              2229
            ],
            [
              "Bonny General Hospital",
              1577
            ],
            [
              "Bonny Health Centre",
              136
            ],
            [
              "St. Peter's Clinic",
              34
            ],
            [
              "St. Charles Surgery",
              5
            ]
          ]
        },
        {
          name: "Ogu/Bolo",
          id: "Ogu/Bolo",
          data: [
            [
              "Ogu Primary Health Centre",
              2631
            ]
          ]
        },
        {
          name: "Ahoada West",
          id: "Ahoada West",
          data: [
            [
              "Joinkrama General Hospital",
              2292
            ],
            [
              "Lengro Medical Centre",
              39
            ]
          ]
        },
        {
          name: "Emuoha",
          id: "Emuoha",
          data: [
            [
              "Rumuji Model Primary Health Centre",
              1357
            ],
            [
              "Ndele Model Primary Health Centre",
              821
            ]
          ]
        },
        {
          name: "Omuma",
          id: "Omuma",
          data: [
            [
              "Obioha Model Primary Health Centre",
              1588
            ]
          ]
        },
        {
          name: "Abua/Odual",
          id: "Abua/Odual",
          data: [
            [
              "Abua General Hospital",
              1543
            ]
          ]
        },
        {
          name: "Asari-Toru",
          id: "Asari-Toru",
          data: [
            [
              "Buguma Model Primary Health Centre",
              306
            ]
          ]
        },
        {
          name: "Akuku-Toru",
          id: "Akuku-Toru",
          data: [
            [
              "Abonnema Comprehensive Health Centre",
              73
            ]
          ]
        },
        {
          name: "Rivers",
          id: "Rivers",
          data: [
            {
              name: "Obio/Akpor",
              y: 53782,
              drilldown: "Obio/Akpor"
            },
            {
              name: "Khana",
              y: 20659,
              drilldown: "Khana"
            },
            {
              name: "port harcourt",
              y: 13716,
              drilldown: "port harcourt"
            },
            {
              name: "Gokana",
              y: 12707,
              drilldown: "Gokana"
            },
            {
              name: "Ogba/Egbema/Ndoni",
              y: 12653,
              drilldown: "Ogba/Egbema/Ndoni"
            },
            {
              name: "Tai",
              y: 11305,
              drilldown: "Tai"
            },
            {
              name: "Okrika",
              y: 9207,
              drilldown: "Okrika"
            },
            {
              name: "Ahoada East",
              y: 6903,
              drilldown: "Ahoada East"
            },
            {
              name: "Degema",
              y: 6887,
              drilldown: "Degema"
            },
            {
              name: "Etche",
              y: 5209,
              drilldown: "Etche"
            },
            {
              name: "Eleme",
              y: 4967,
              drilldown: "Eleme"
            },
            {
              name: "Oyigbo",
              y: 4878,
              drilldown: "Oyigbo"
            },
            {
              name: "Ikwerre",
              y: 4770,
              drilldown: "Ikwerre"
            },
            {
              name: "Bonny",
              y: 3981,
              drilldown: "Bonny"
            },
            {
              name: "Ogu/Bolo",
              y: 2631,
              drilldown: "Ogu/Bolo"
            },
            {
              name: "Ahoada West",
              y: 2331,
              drilldown: "Ahoada West"
            },
            {
              name: "Emuoha",
              y: 2178,
              drilldown: "Emuoha"
            },
            {
              name: "Omuma",
              y: 1588,
              drilldown: "Omuma"
            },
            {
              name: "Abua/Odual",
              y: 1543,
              drilldown: "Abua/Odual"
            },
            {
              name: "Asari-Toru",
              y: 306,
              drilldown: "Asari-Toru"
            },
            {
              name: "Akuku-Toru",
              y: 73,
              drilldown: "Akuku-Toru"
            }
          ]
        },
        {
          name: "AMAC",
          id: "AMAC",
          data: [
            [
              "Gwarinpa One Stop Shop",
              7074
            ],
            [
              "Nyanya One Stop Shop",
              5150
            ],
            [
              "Asokoro District Hospital",
              4845
            ],
            [
              "National Hospital - Abuja",
              3473
            ],
            [
              "Maitama General Hospital",
              2926
            ],
            [
              "fc Wuse District Hospital",
              2600
            ],
            [
              "National Institute For Pharmaceutical Research - Idu",
              2166
            ],
            [
              "MABUSHI One Stop Shop",
              2067
            ],
            [
              "Garki Hospital Abuja",
              1920
            ],
            [
              "Nyanya General Hospital",
              1716
            ],
            [
              "Gwarimpa General Hospital",
              1560
            ],
            [
              "KPIF_Gwarinpa OSS",
              1528
            ],
            [
              "Kubwa General Hospital",
              1443
            ],
            [
              "Lugbe Primary Health Center",
              1384
            ],
            [
              "Idu Karimo Primary Health Center",
              1286
            ],
            [
              "Karshi General Hospital",
              1233
            ],
            [
              "International Center for Advocacy on Rights to Health",
              1224
            ],
            [
              "Federal Staff Hospital - Jabi",
              1012
            ],
            [
              "Sisters of Nativity Hospital (SON) - Jikwoyi",
              982
            ],
            [
              "Custom Staff Clinic",
              922
            ],
            [
              "Police Clinic - Abuja",
              621
            ],
            [
              "Kabusa Primary Health Center",
              617
            ],
            [
              "Mpape Primary Health Center",
              544
            ],
            [
              "Evangelical Church of West Africa (ECWA) Medical Center",
              503
            ],
            [
              "State House Clinic",
              410
            ],
            [
              "Gidan Mangoro Primary Health Center",
              390
            ],
            [
              "YOUTHRISE One Stop Shop",
              317
            ],
            [
              "Jahi Primary Health Center",
              305
            ],
            [
              "Karu Primary Health Center",
              283
            ],
            [
              "Federal Staff Hospital - Gwarimpa",
              268
            ],
            [
              "Jikwoyi Primary Health Center",
              239
            ],
            [
              "Gwagwa Primary Health Center",
              208
            ],
            [
              "The Crown Hospital",
              191
            ],
            [
              "Evangelical Church of West Africa (ECWA) Health Clinic - Kabusa",
              187
            ],
            [
              "Medical Missions of Mary - Lugbe",
              176
            ],
            [
              "Iddo Pada Primary Health Center",
              157
            ],
            [
              "Dutsen Garki Primary Health Center",
              148
            ],
            [
              "King's Care Hospital",
              143
            ],
            [
              "Pan-Raf Hospital",
              143
            ],
            [
              "Rainbow Hospital and Maternity",
              136
            ],
            [
              "Azriel Hosptial Lugbe",
              133
            ],
            [
              "360 Care Clinic & Maternity- Mpape",
              131
            ],
            [
              "Faith Medical Center - Karimo",
              126
            ],
            [
              "Jikwoyi Medical Center",
              124
            ],
            [
              "Pigba Medical Center",
              120
            ],
            [
              "Kpaduma Primary Health Center",
              115
            ],
            [
              "Cornelian Maternity and Rural Health - Gidan Mangoro",
              110
            ],
            [
              "Diamond Medical Center",
              100
            ],
            [
              "Ruz Medical and Diagnostic Centre",
              86
            ],
            [
              "Kuchingoro Primary Health Center",
              84
            ],
            [
              "Massan Clinic Limited",
              84
            ],
            [
              "Bethel Clinic and Maternity",
              79
            ],
            [
              "Yabisam Hospital",
              67
            ],
            [
              "Kagini Primary Health Center",
              64
            ],
            [
              "Getwell Hospital",
              59
            ],
            [
              "Freedomscan Medical Center",
              54
            ],
            [
              "Cream Medics",
              42
            ],
            [
              "Rapha Hospital",
              29
            ],
            [
              "Standard Care Hospital",
              28
            ]
          ]
        },
        {
          name: "Gwagwalada",
          id: "Gwagwalada",
          data: [
            [
              "Gwagwalada KP One Stop Shop",
              12422
            ],
            [
              "University Of Abuja Teaching Hospital - Gwagwalda",
              5452
            ],
            [
              "fc St Mary Catholic Hospital -  Gwagwalada",
              1700
            ],
            [
              "Anawim OSS",
              1096
            ],
            [
              "Gwagwalada Township Clinic",
              645
            ],
            [
              "Dagiri Primary Health Center",
              450
            ],
            [
              "Minat Clinic",
              150
            ],
            [
              "Joefag Alheri Clinic and Maternity",
              129
            ],
            [
              "Alheri Kuntuku Clinic",
              80
            ],
            [
              "Living Rock Hospital and Maternity",
              70
            ],
            [
              "Jerab Hospitals",
              66
            ],
            [
              "Zuba Primary Health Center",
              54
            ],
            [
              "Diamond Crest Hospital and Maternity",
              51
            ],
            [
              "Gwagwalada Clinic and Maternity",
              41
            ]
          ]
        },
        {
          name: "Bwari",
          id: "Bwari",
          data: [
            [
              "Daughters of Charity (DOC) Hospital - Kubwa",
              2691
            ],
            [
              "Bwari General Hospital",
              758
            ],
            [
              "Excellence and Friends Management Consult (EFMC) Care Center (Modern Health Hospital)",
              520
            ],
            [
              "Dutse Alhaji Primary Health Centre",
              517
            ],
            [
              "Our Lady of Fatima Hospital - Bwari",
              462
            ],
            [
              "Sabon Gari Primary Health Center",
              438
            ],
            [
              "Dei Dei Comprehensive Health Center",
              416
            ],
            [
              "Kogo Primary Health Center",
              375
            ],
            [
              "St. Andrews Anglican Hospital - Kubwa",
              245
            ],
            [
              "Omega Hospital",
              216
            ],
            [
              "Sumit Hospital",
              101
            ],
            [
              "Bwari Medical Center",
              100
            ],
            [
              "Goodness Land Clinic and Maternity",
              93
            ],
            [
              "Gabic Divine Clinic and Maternity",
              87
            ],
            [
              "Unity Clinic and Maternity",
              76
            ],
            [
              "Dominion Hospital",
              61
            ],
            [
              "Laura Hospital and Maternity",
              42
            ],
            [
              "M-Dali Hospital",
              29
            ]
          ]
        },
        {
          name: "Abaji",
          id: "Abaji",
          data: [
            [
              "Abaji General Hospital",
              748
            ],
            [
              "Ayaura Comprehensive Health Centre",
              498
            ]
          ]
        },
        {
          name: "Kwali",
          id: "Kwali",
          data: [
            [
              "Kwali General Hospital",
              566
            ],
            [
              "Rhema Hospital Kwali",
              398
            ],
            [
              "Dabibako Primary Health Center",
              116
            ]
          ]
        },
        {
          name: "Kuje",
          id: "Kuje",
          data: [
            [
              "Kuje Primary Health Center",
              172
            ],
            [
              "Gaube Comprehensive Health Centre",
              141
            ]
          ]
        },
        {
          name: "FCT",
          id: "FCT",
          data: [
            {
              name: "AMAC",
              y: 54132,
              drilldown: "AMAC"
            },
            {
              name: "Gwagwalada",
              y: 22406,
              drilldown: "Gwagwalada"
            },
            {
              name: "Bwari",
              y: 7227,
              drilldown: "Bwari"
            },
            {
              name: "Abaji",
              y: 1246,
              drilldown: "Abaji"
            },
            {
              name: "Kwali",
              y: 1080,
              drilldown: "Kwali"
            },
            {
              name: "Kuje",
              y: 313,
              drilldown: "Kuje"
            }
          ]
        },
        {
          name: "Karu",
          id: "Karu",
          data: [
            [
              "KPIF_Karu OSS",
              4788
            ],
            [
              "Karu KP one stop shop",
              4611
            ],
            [
              "Mararaba Guruku Medical Center",
              3834
            ],
            [
              "Masaka Primary Health Care",
              1477
            ],
            [
              "Uke General Hospital",
              1031
            ],
            [
              "Maraba Gurku Primary Health Center",
              910
            ],
            [
              "K-Health (Adult Adolescent Program)",
              555
            ],
            [
              "Karu Primary Health Center",
              518
            ],
            [
              "Mission Hopsital",
              383
            ],
            [
              "Kpamu Shammah Hospital",
              249
            ],
            [
              "Adonai Hospital",
              216
            ],
            [
              "Nakowa Clinic",
              215
            ],
            [
              "Anointed Clinic",
              155
            ],
            [
              "Nyanya Gbagi Primary Health Care Center",
              143
            ],
            [
              "Nisi Hospital",
              116
            ],
            [
              "Ojone Favour",
              111
            ],
            [
              "Gidan Zakara Primary Health Center",
              108
            ],
            [
              "Mayday Specialist Hospital And Maternity",
              99
            ],
            [
              "Auta Primary Health Center",
              95
            ],
            [
              "Gunduma Primary Health Center",
              92
            ],
            [
              "Aso Panda Primary Health Care Center",
              89
            ],
            [
              "Alheri Clinic and Maternity",
              79
            ],
            [
              "Gora Primary Health Center",
              70
            ],
            [
              "Maraba Clinic and Maternity",
              68
            ],
            [
              "Best Clinic",
              53
            ],
            [
              "Pijag Maternity Home",
              51
            ],
            [
              "Kingscare Hospital",
              43
            ],
            [
              "Alheri Clinic and Maternity_U Turn (Karu)",
              32
            ],
            [
              "Jankanwa Primary Health Center",
              25
            ]
          ]
        },
        {
          name: "Lafia",
          id: "Lafia",
          data: [
            [
              "Dalhatu Araf Specialist Hospital",
              5184
            ],
            [
              "Lafia KP One Stop Shop",
              5182
            ],
            [
              "Shabu Model Comprehensive Center",
              2387
            ],
            [
              "Doma Road Primary Health Care Center",
              352
            ],
            [
              "New Market Road Primary Health Center",
              351
            ],
            [
              "Barkin Abdullahi Primary Health Center",
              289
            ],
            [
              "Namu Clinic",
              255
            ],
            [
              "Kowa Hospital",
              229
            ],
            [
              "Tudun Gwandara Primary Health Center",
              225
            ],
            [
              "Gidan Maiakuya Primary Health Center",
              219
            ],
            [
              "PHC Tudun Kauri",
              206
            ],
            [
              "Diamond Clinic - Lafiya",
              199
            ],
            [
              "Assakio Primary Health Center",
              190
            ],
            [
              "Adogi Primary Health Care",
              168
            ],
            [
              "Voice of Islam Hospital",
              160
            ],
            [
              "Sauki Hospital",
              143
            ],
            [
              "Aboki Clinic",
              129
            ],
            [
              "Graceland Clinic - Lafiya",
              113
            ],
            [
              "Oshyegba Medical Center",
              113
            ],
            [
              "Agu Hospital",
              86
            ],
            [
              "M&D Hospital",
              67
            ],
            [
              "Azuba Bashayi Primary Health Center",
              51
            ],
            [
              "Sadanji Medical Center",
              50
            ],
            [
              "Gosha Clinic And Maternity",
              49
            ],
            [
              "Lafia Clinic",
              47
            ],
            [
              "Olivet Medical Center",
              41
            ],
            [
              "The Chrane Hospital",
              32
            ],
            [
              "Wadata Primary Health center",
              8
            ]
          ]
        },
        {
          name: "Akwanga",
          id: "Akwanga",
          data: [
            [
              "KPIF_Akwanga OSS",
              4449
            ],
            [
              "Our Lady of Apostles Hospital - Akwanga",
              2857
            ],
            [
              "Akwanga General Hospital",
              2818
            ],
            [
              "Mochu Clinic",
              467
            ],
            [
              "Akwanga Primary Health Care Center",
              358
            ],
            [
              "Rinze Primary Health Care Center",
              355
            ],
            [
              "Gudi Primary Health Care Center",
              224
            ],
            [
              "Orient Hospital",
              95
            ],
            [
              "Royal Hospital",
              74
            ],
            [
              "Nunku Primary Health Care Center",
              36
            ],
            [
              "Andaha Primary Health Care Center",
              19
            ]
          ]
        },
        {
          name: "Keffi",
          id: "Keffi",
          data: [
            [
              "Federal Medical Center - Keffi",
              5200
            ],
            [
              "Keffi General Hospital",
              1074
            ],
            [
              "Anguwan Waje Primary Health Care",
              558
            ],
            [
              "Innovative Biotech",
              518
            ],
            [
              "Shukura Specialist Hospital",
              151
            ],
            [
              "Imani Clinic",
              147
            ],
            [
              "Amosun Maternity Hospital",
              53
            ],
            [
              "Evangelical Reformed Church of Christ (ERCC) Clinic - Keffi",
              16
            ]
          ]
        },
        {
          name: "Obi",
          id: "Obi",
          data: [
            [
              "na Obi General Hospital",
              1898
            ],
            [
              "Imon Primary Health Center",
              540
            ],
            [
              "Obi Primary Health Care Center - Agyragu",
              483
            ],
            [
              "St. Bernards Clinic - Akanga",
              356
            ],
            [
              "Evangelical Reformed Church of Christ (ERCC) Clinic - Murya",
              343
            ],
            [
              "Tudun Adabu Primary Health Center",
              212
            ],
            [
              "Azomeh Clinic",
              189
            ],
            [
              "Mother and Child Welfare Clinic 1",
              163
            ],
            [
              "Catholic Maternity and Rural Health Center -Agwatashi",
              152
            ],
            [
              "Ikon Allah Iroh Hospital",
              93
            ],
            [
              "Imani Clinic",
              53
            ]
          ]
        },
        {
          name: "Nasarawa",
          id: "Nasarawa_LGA",
          data: [
            [
              "na Nasarawa General Hospital",
              2302
            ],
            [
              "Main Town Nasarawa Primary Health Care",
              736
            ],
            [
              "General Hospital Mararaba Odege",
              394
            ],
            [
              "Mararaba Odege Primary Health Care Center",
              326
            ],
            [
              "Loko Primary Health Center",
              194
            ],
            [
              "Nasara Clinic  -   Ara",
              107
            ],
            [
              "Henad Medical Center",
              76
            ],
            [
              "Nasarawa Medical Center",
              66
            ],
            [
              "Alpha Medical Center",
              33
            ],
            [
              "Loko 2 Kekura Road Primary Health Care Center",
              19
            ],
            [
              "Laminga Primary Health Center",
              17
            ],
            [
              "Marmara Primary Health Center",
              16
            ],
            [
              "Ara 2 Primary Health Center",
              13
            ]
          ]
        },
        {
          name: "Doma",
          id: "Doma",
          data: [
            [
              "Doma General Hospital",
              1877
            ],
            [
              "Sabo Clinic",
              191
            ],
            [
              "Doma Primary Health Center",
              188
            ],
            [
              "Burum-Burum Primary Health Center",
              115
            ],
            [
              "Idadu Primary Health Center",
              114
            ],
            [
              "Rukubi Primary Health Center",
              108
            ],
            [
              "New Era Clinic",
              106
            ],
            [
              "Arumangye Bosco Primary Health Center",
              97
            ],
            [
              "Owoche Clinic and Maternity",
              94
            ],
            [
              "Zumunta Yelwa Ediya Clinic",
              92
            ],
            [
              "Shalom Clinic",
              68
            ],
            [
              "Okpatte Primary Health Center",
              46
            ]
          ]
        },
        {
          name: "Nasarawa Egon",
          id: "Nasarawa Egon",
          data: [
            [
              "Nasarawa Eggon General Hospital",
              2150
            ],
            [
              "Alushi ERCC",
              668
            ],
            [
              "Omatdefu Clinic and Maternity",
              51
            ]
          ]
        },
        {
          name: "Kokona",
          id: "Kokona",
          data: [
            [
              "Garaku General Hospital",
              1512
            ],
            [
              "Tamaiko Clinic",
              121
            ],
            [
              "Mak-lin Clinic",
              89
            ],
            [
              "Minlap Clinic",
              59
            ]
          ]
        },
        {
          name: "Wamba",
          id: "Wamba",
          data: [
            [
              "Wamba General Hospital",
              1411
            ]
          ]
        },
        {
          name: "Awe",
          id: "Awe",
          data: [
            [
              "Awe General Hospital",
              632
            ],
            [
              "Jatau Clinic",
              192
            ]
          ]
        },
        {
          name: "Keana",
          id: "Keana",
          data: [
            [
              "Kadarko National Primary Health Care - Giza Development Area",
              256
            ],
            [
              "Keana General Hospital",
              177
            ]
          ]
        },
        {
          name: "Toto",
          id: "Toto",
          data: [
            [
              "Toto General Hospital",
              319
            ],
            [
              "Umaisha General Hospital",
              80
            ]
          ]
        },
        {
          name: "Nasarawa",
          id: "Nasarawa",
          data: [
            {
              name: "Karu",
              y: 20216,
              drilldown: "Karu"
            },
            {
              name: "Lafia",
              y: 16525,
              drilldown: "Lafia"
            },
            {
              name: "Akwanga",
              y: 11752,
              drilldown: "Akwanga"
            },
            {
              name: "Keffi",
              y: 7717,
              drilldown: "Keffi"
            },
            {
              name: "Obi",
              y: 4482,
              drilldown: "Obi"
            },
            {
              name: "Nasarawa",
              y: 4299,
              drilldown: "Nasarawa_LGA"
            },
            {
              name: "Doma",
              y: 3096,
              drilldown: "Doma"
            },
            {
              name: "Nasarawa Egon",
              y: 2869,
              drilldown: "Nasarawa Egon"
            },
            {
              name: "Kokona",
              y: 1781,
              drilldown: "Kokona"
            },
            {
              name: "Wamba",
              y: 1411,
              drilldown: "Wamba"
            },
            {
              name: "Awe",
              y: 824,
              drilldown: "Awe"
            },
            {
              name: "Keana",
              y: 433,
              drilldown: "Keana"
            },
            {
              name: "Toto",
              y: 399,
              drilldown: "Toto"
            }
          ]
        },
        {
          name: "Katsina",
          id: "Katsina",
          data: [
            [
              "Katsina General Hospital",
              2874
            ],
            [
              "Federal Medical Center - Katsina",
              1473
            ],
            [
              "Alheri Clinic",
              91
            ],
            [
              "Abdull Jalil's (A.J.S.) Out Patient Clinic",
              84
            ]
          ]
        },
        {
          name: "Funtua",
          id: "Funtua",
          data: [
            [
              "Funtua General Hospital",
              3809
            ]
          ]
        },
        {
          name: "Daura",
          id: "Daura",
          data: [
            [
              "kt Daura General Hospital",
              1168
            ]
          ]
        },
        {
          name: "Malumfashi",
          id: "Malumfashi",
          data: [
            [
              "Malumfashi General Hospital",
              708
            ],
            [
              "Malumfashi Maternal and Child Health Clinic",
              167
            ]
          ]
        },
        {
          name: "Dutsin Ma",
          id: "Dutsin Ma",
          data: [
            [
              "kt Dutsinma General Hospital",
              844
            ]
          ]
        },
        {
          name: "Kankia",
          id: "Kankia",
          data: [
            [
              "Kankia General Hospital",
              604
            ]
          ]
        },
        {
          name: "Kankara",
          id: "Kankara",
          data: [
            [
              "Kankara General Hospital",
              517
            ]
          ]
        },
        {
          name: "Musawa",
          id: "Musawa",
          data: [
            [
              "Musawa General Hospital",
              450
            ]
          ]
        },
        {
          name: "Mani",
          id: "Mani",
          data: [
            [
              "Mani General Hospital",
              325
            ]
          ]
        },
        {
          name: "Jibia",
          id: "Jibia",
          data: [
            [
              "Jibia General Hospital",
              299
            ]
          ]
        },
        {
          name: "Dan Musa",
          id: "Dan Musa",
          data: [
            [
              "Danmusa General Hospital",
              256
            ]
          ]
        },
        {
          name: "Batsari",
          id: "Batsari",
          data: [
            [
              "Batsari General Hospital",
              255
            ]
          ]
        },
        {
          name: "Rimi",
          id: "Rimi",
          data: [
            [
              "Rimi General Hospital",
              203
            ]
          ]
        },
        {
          name: "Ingawa",
          id: "Ingawa",
          data: [
            [
              "Ingawa General Hospital",
              165
            ]
          ]
        },
        {
          name: "Baure",
          id: "Baure",
          data: [
            [
              "Baure General Hospital",
              107
            ]
          ]
        },
        {
          name: "Katsina",
          id: "Katsina",
          data: [
            {
              name: "Katsina",
              y: 4522,
              drilldown: "Katsina"
            },
            {
              name: "Funtua",
              y: 3809,
              drilldown: "Funtua"
            },
            {
              name: "Daura",
              y: 1168,
              drilldown: "Daura"
            },
            {
              name: "Malumfashi",
              y: 875,
              drilldown: "Malumfashi"
            },
            {
              name: "Dutsin Ma",
              y: 844,
              drilldown: "Dutsin Ma"
            },
            {
              name: "Kankia",
              y: 604,
              drilldown: "Kankia"
            },
            {
              name: "Kankara",
              y: 517,
              drilldown: "Kankara"
            },
            {
              name: "Musawa",
              y: 450,
              drilldown: "Musawa"
            },
            {
              name: "Mani",
              y: 325,
              drilldown: "Mani"
            },
            {
              name: "Jibia",
              y: 299,
              drilldown: "Jibia"
            },
            {
              name: "Dan Musa",
              y: 256,
              drilldown: "Dan Musa"
            },
            {
              name: "Batsari",
              y: 255,
              drilldown: "Batsari"
            },
            {
              name: "Rimi",
              y: 203,
              drilldown: "Rimi"
            },
            {
              name: "Ingawa",
              y: 165,
              drilldown: "Ingawa"
            },
            {
              name: "Baure",
              y: 107,
              drilldown: "Baure"
            }
          ]
        }
      ]
  }
}


// Age categories
const categoriess =  [
  {
    name: "25 +",
    y: 1555293
  },
  {
    name: "20 - 24",
    y: 107980
  },
  {
    name: "10 - 19",
    y: 51435
  },
  {
    name: "≤ 9",
    y: 22870
  }
]

const age = {
  chart: {
      type: 'bar'
  },
  title: {
      text: 'Patients Currently Receiving ART by Sex and Age Group'
  },
  subtitle: {
      text: ''
  },
  accessibility: {
      point: {
          valueDescriptionFormat: '{index}. Age {xDescription}, {value}%.'
      }
  },
  xAxis: [
    {
      categories: categoriess,
      reversed: false,
      labels: {
          step: 1
      },
      accessibility: {
          description: 'Age (male)'
      }
  }, { // mirror axis on right side
      opposite: true,
      reversed: false,
      categories: categoriess,
      linkedTo: 0,
      labels: {
          step: 1
      },
      accessibility: {
          description: 'Age (female)'
      }
  }
],
  yAxis: {
      title: {
          text: null
      },
      accessibility: {
          description: 'Percentage population',
          rangeDescription: 'Range: 0 to 5%'
      }
  },
  colors: [
    '#a3a8e2',
    '#494fa3'
],
  plotOptions: {
      series: {
          stacking: 'normal'
      }
  },
  series: [
    {
      name: 'Male',
      data: [
        -18,
        -3072,
        -8457,
        -11293,
        -12495,
        -40617,
        -74093,
        -89355,
        -85184,
        -94760,
        -73505,
        -126008
      ]
  }, {
      name: 'Female',
      data:   [
              17,
              3050,
              8256,
              11596,
              16051,
              67363,
              149019,
              215943,
              204781,
              175180,
              108775,
              158690
    ]
  }
]
}


  return (
    <div className='app-user-list'>
      <IndicatorFilter sidebarOpen={sidebarOpen} />
      <Row lg='7'>
        <Col lg='4' sm='6'>
          <StatsHorizontal
            color='primary'
            statTitle='PATIENTS'
            icon={<User size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>358,881</h3>}
          />
        </Col>
        <Col lg='4' sm='6'>
          <StatsHorizontal
            color='danger'
            statTitle='FACILITIES'
            icon={<UserPlus size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>357</h3>}
          />
        </Col>
        <Col lg='4' sm='6'>
          <StatsHorizontal
            color='success'
            statTitle='STATES'
            icon={<UserCheck size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>4</h3>}
          />
        </Col> 
        <Col lg='6' sm='6'>     
        <HighchartsReact  highcharts={Highcharts}  options={txCURRData} />    
        </Col> 
        <Col lg='6' sm='6'>

        <HighchartsReact  highcharts={Highcharts}  options={age} />
        </Col>
      </Row>
    </div>
  )
}

export default UsersList
