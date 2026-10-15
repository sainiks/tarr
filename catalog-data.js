// Representative structure only. Replace these examples with verified company catalog data.
window.CATALOG_DATA = [
  { id:'bearings', name:'Bearings & bearing units', group:'ROTARY SUPPORT', subcategories:[
    { name:'Deep groove ball bearings', specs:'Bore · outside diameter · width · seal · clearance', models:['6000 series','6200 series','6300 series','6400 series'] },
    { name:'Tapered roller bearings', specs:'Bore · cup/cone · load direction · clearance', models:['30200 series','30300 series','32200 series','32300 series'] },
    { name:'Spherical roller bearings', specs:'Bore · outside diameter · cage · clearance', models:['22200 series','22300 series','23000 series','24000 series'] },
    { name:'Cylindrical roller bearings', specs:'Bore · roller row · flange · cage', models:['N series','NU series','NJ series','NUP series'] },
    { name:'Mounted & pillow block units', specs:'Shaft diameter · housing style · seal · base pattern', models:['UCP pillow block','UCF flange unit','UCFL oval flange','UCT take-up unit'] }
  ]},
  { id:'gears', name:'Gears & racks', group:'ROTARY MOTION', subcategories:[
    { name:'Spur gears', specs:'Module · teeth · bore · pressure angle · material', models:['Module 1 precision','Module 1.5 standard','Module 2 heavy duty','Module 3 industrial'] },
    { name:'Helical gears', specs:'Module · helix angle · hand · teeth · bore', models:['Single helical','Double helical','Right-hand helix','Left-hand helix'] },
    { name:'Worm gears & wheels', specs:'Ratio · center distance · lead · material pair', models:['Single-start worm','Two-start worm','Bronze wheel set','Nylon wheel set'] },
    { name:'Gear racks & pinions', specs:'Module · length · pitch · tooth profile · mounting', models:['Straight rack','Helical rack','Round rack','Rack & pinion set'] },
    { name:'Bevel gears', specs:'Ratio · module · shaft angle · tooth count', models:['Straight bevel','Spiral bevel','Miter gear pair','Crown gear'] }
  ]},
  { id:'gearboxes', name:'Gearboxes & reducers', group:'SPEED REDUCTION', subcategories:[
    { name:'Worm gear reducers', specs:'Ratio · input power · output torque · mounting', models:['NMRV 025–050 frame','NMRV 063–090 frame','NMRV 110–150 frame','Single / double reduction'] },
    { name:'Inline helical gearboxes', specs:'Ratio · service factor · shaft style · mounting', models:['R compact frame','R standard frame','R heavy frame','Inline gearmotor'] },
    { name:'Bevel helical gearboxes', specs:'Ratio · torque · shaft orientation · mounting', models:['K foot mount','K flange mount','Right-angle hollow shaft','Right-angle solid shaft'] },
    { name:'Planetary gearboxes', specs:'Ratio · backlash · rated torque · input interface', models:['P042 precision','P060 precision','P090 precision','P115 high torque'] }
  ]},
  { id:'belts', name:'Belts & pulleys', group:'POWER TRANSFER', subcategories:[
    { name:'Timing belts', specs:'Pitch · length · width · tooth profile · material', models:['HTD 3M profile','HTD 5M profile','HTD 8M profile','HTD 14M profile'] },
    { name:'V-belts', specs:'Section · inside length · construction · matched set', models:['Classical A / B / C','Narrow SPZ / SPA','Narrow SPB / SPC','Raw-edge cogged'] },
    { name:'Timing pulleys', specs:'Pitch · tooth count · bore · flange · material', models:['3M pitch pulley','5M pitch pulley','8M pitch pulley','14M pitch pulley'] },
    { name:'Flat & ribbed belts', specs:'Profile · length · width · rib count · tension', models:['PJ poly-V profile','PK poly-V profile','PL poly-V profile','Flat drive belt'] }
  ]},
  { id:'chains', name:'Chains & sprockets', group:'POWER TRANSFER', subcategories:[
    { name:'Roller chains', specs:'Pitch · strand count · link count · attachment', models:['06B / 3⁄8 in pitch','08B / 1⁄2 in pitch','10B / 5⁄8 in pitch','12B / 3⁄4 in pitch'] },
    { name:'Sprockets', specs:'Chain standard · teeth · bore · hub · material', models:['Plate sprocket','Single hub sprocket','Double hub sprocket','Taper-lock sprocket'] },
    { name:'Attachment chains', specs:'Chain series · attachment type · pitch · spacing', models:['A1 attachment','K1 attachment','SA1 attachment','SK1 attachment'] },
    { name:'Conveyor chains', specs:'Pitch · width · material · load · environment', models:['Table-top chain','Hollow-pin chain','Roller-top chain','Engineered link chain'] }
  ]},
  { id:'motors', name:'Motors & electrical drives', group:'ELECTRICAL MOTION', subcategories:[
    { name:'AC induction motors', specs:'Power · frame · poles · voltage · efficiency · mount', models:['IEC 63–80 frame','IEC 90–112 frame','IEC 132–160 frame','IEC 180–225 frame'] },
    { name:'Brake motors', specs:'Power · frame · brake torque · voltage · mount', models:['Compact brake motor','Spring-applied brake','DC brake package','Geared brake motor'] },
    { name:'Servo & stepper motors', specs:'Rated torque · speed · encoder · flange · drive', models:['NEMA 17 stepper','NEMA 23 stepper','400 W servo class','750 W servo class'] },
    { name:'Variable frequency drives', specs:'Motor power · input phase · voltage · overload', models:['0.4–2.2 kW class','3–7.5 kW class','11–22 kW class','30 kW+ class'] }
  ]},
  { id:'couplings', name:'Couplings & shaft connections', group:'ROTARY CONNECTION', subcategories:[
    { name:'Jaw & spider couplings', specs:'Bore pair · torque · spider hardness · misalignment', models:['L050 compact','L075 standard','L095 heavy duty','L110 high torque'] },
    { name:'Tyre & flexible couplings', specs:'Bore · torque · element hardness · spacer length', models:['F-series small frame','F-series medium frame','F-series large frame','Spacer coupling'] },
    { name:'Oldham & beam couplings', specs:'Bore · outer diameter · torque · misalignment', models:['Oldham compact','Oldham standard','Single-beam helical','Multi-beam helical'] },
    { name:'Grid & gear couplings', specs:'Bore · rated torque · cover · lubrication', models:['Grid flexible coupling','Full-flex gear coupling','Half-flex gear coupling','Rigid sleeve coupling'] }
  ]},
  { id:'linear', name:'Linear motion', group:'LINEAR MOTION', subcategories:[
    { name:'Linear guide rails', specs:'Rail size · length · accuracy · preload · coating', models:['HGR15 rail','HGR20 rail','HGR25 rail','HGR30 rail'] },
    { name:'Linear guide blocks', specs:'Rail match · block style · preload · seal', models:['HGH square block','HGW flange block','EGH compact block','QH quiet block'] },
    { name:'Ball screws', specs:'Diameter · lead · length · accuracy · end machining', models:['SFU1204 / 12 mm','SFU1605 / 16 mm','SFU2005 / 20 mm','SFU2505 / 25 mm'] },
    { name:'Linear bearings & shafts', specs:'Shaft diameter · bearing length · seal · housing', models:['LM10 compact','LM12 standard','LM16 standard','LM20 heavy duty'] },
    { name:'Actuators & support units', specs:'Stroke · load · speed · mounting · duty cycle', models:['Ball screw actuator','Belt-driven actuator','Fixed-end support','Floating-end support'] }
  ]},
  { id:'shaft-hardware', name:'Shafts & mounting hardware', group:'MACHINE ELEMENTS', subcategories:[
    { name:'Precision shafts', specs:'Diameter · length · tolerance · finish · end detail', models:['Ground shaft h6','Hardened shaft','Keyway shaft','Cut-to-length shaft'] },
    { name:'Shaft collars & locking', specs:'Shaft diameter · clamp style · material · torque', models:['One-piece collar','Two-piece collar','Threaded locking collar','Taper-lock bush'] },
    { name:'Keys & key stock', specs:'Width · height · length · standard · material', models:['Square key stock','Rectangular key stock','Woodruff key','Stainless key stock'] },
    { name:'Bushings & spacers', specs:'ID · OD · length · material · tolerance', models:['Flanged bronze bush','Sleeve bush','Oil-impregnated bush','Precision spacer'] }
  ]},
  { id:'custom', name:'Custom & made-to-drawing', group:'ENGINEERED TO SPEC', subcategories:[
    { name:'Custom gears', specs:'Drawing · module · material · heat treatment · quantity', models:['Custom spur gear','Custom helical gear','Custom worm set','Custom rack & pinion'] },
    { name:'Turned components', specs:'Drawing · material · tolerance · finish · batch size', models:['Shafts & pins','Bushes & sleeves','Spacers & standoffs','Threaded components'] },
    { name:'Milled components', specs:'Drawing · material · datum · tolerance · finish', models:['Mounting plates','Brackets & blocks','Housings','Fixtures & tooling'] },
    { name:'Reverse engineering', specs:'Sample part · critical dimensions · material · quantity', models:['Measure & reproduce','Repair replacement','Obsolete component','Prototype to production'] }
  ]}
];
