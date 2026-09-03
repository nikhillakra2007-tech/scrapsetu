"""
Kabadiwala Connect (ScrapSetu) — Centralized E-Waste Taxonomy & Benchmark Rates
Aligned with Delhi Pilot (Okhla, Mandoli, Patparganj, Peeragarhi, Mohan Cooperative)
and India's E-Waste (Management) Rules 2022 Schedule I.
"""

from typing import Dict, Any, List

MATERIAL_TAXONOMY: Dict[str, Dict[str, Any]] = {
    "PCB": {
        "parent_name": "Printed Circuit Boards",
        "is_hazardous": True,
        "default_hazard": "acid_leaching_risk",
        "safety_note": "Do not burn or subject to acid washing. Contains gold/palladium plating; route exclusively to authorized recyclers with hydrometallurgical recovery.",
        "sub_categories": {
            "computer_motherboard": {"sub_name": "Computer Motherboard", "avg_rate": 380.0, "min_rate": 340.0, "max_rate": 430.0},
            "mobile_pcb": {"sub_name": "Mobile Phone PCB (High Grade)", "avg_rate": 450.0, "min_rate": 400.0, "max_rate": 520.0},
            "appliance_pcb": {"sub_name": "Low-Grade Appliance PCB", "avg_rate": 160.0, "min_rate": 130.0, "max_rate": 190.0},
            "mixed_unsorted_pcb": {"sub_name": "Mixed Unsorted Circuit Boards", "avg_rate": 220.0, "min_rate": 180.0, "max_rate": 260.0},
        },
        "epr_hint": "Schedule I (ITEW2 to ITEW16)",
    },
    "BATTERY": {
        "parent_name": "Batteries & Cells",
        "is_hazardous": True,
        "default_hazard": "lithium_swelling",
        "safety_note": "Keep dry and cool. Never crush, puncture, or short-circuit terminals. High risk of thermal runaway and fire.",
        "sub_categories": {
            "li_ion_mobile_laptop": {"sub_name": "Lithium-Ion Mobile/Laptop Battery", "avg_rate": 180.0, "min_rate": 150.0, "max_rate": 220.0},
            "lead_acid_ups_inverter_auto": {"sub_name": "Lead-Acid Inverter/UPS Battery", "avg_rate": 95.0, "min_rate": 85.0, "max_rate": 105.0},
            "nicd_nimh": {"sub_name": "NiCd / NiMH Rechargeable Cells", "avg_rate": 45.0, "min_rate": 35.0, "max_rate": 55.0},
            "alkaline_dry_cell": {"sub_name": "Alkaline Dry Cells (AA/AAA)", "avg_rate": 15.0, "min_rate": 10.0, "max_rate": 20.0},
        },
        "epr_hint": "Battery Waste Management Rules 2022",
    },
    "CRT": {
        "parent_name": "Cathode Ray Tubes",
        "is_hazardous": True,
        "default_hazard": "leaded_glass",
        "safety_note": "CAUTION: Heavy leaded funnel glass under high vacuum. Never shatter CRT glass in the open. Breaching releases toxic lead oxide dust.",
        "sub_categories": {
            "tv_crt": {"sub_name": "CRT Television Unit / Glass", "avg_rate": 12.0, "min_rate": 8.0, "max_rate": 16.0},
            "monitor_crt": {"sub_name": "CRT Computer Monitor Tube", "avg_rate": 15.0, "min_rate": 10.0, "max_rate": 20.0},
            "crt_glass_only": {"sub_name": "Cracked / Stripped CRT Glass", "avg_rate": 5.0, "min_rate": 3.0, "max_rate": 8.0},
        },
        "epr_hint": "Schedule I (CEEW1)",
    },
    "LCD_LED_PANEL": {
        "parent_name": "Flat Display Panels",
        "is_hazardous": False,
        "default_hazard": "none",
        "safety_note": "Older CCFL-backlit panels contain trace mercury tubes along edges. Handle screen edges carefully without snapping tubes.",
        "sub_categories": {
            "tv_panel": {"sub_name": "LED/LCD TV Panel (32+ inch)", "avg_rate": 35.0, "min_rate": 25.0, "max_rate": 45.0},
            "monitor_panel": {"sub_name": "Desktop Computer LCD Monitor", "avg_rate": 45.0, "min_rate": 35.0, "max_rate": 55.0},
            "laptop_panel": {"sub_name": "Laptop Slim Display Panel", "avg_rate": 60.0, "min_rate": 45.0, "max_rate": 75.0},
        },
        "epr_hint": "Schedule I (ITEW3, CEEW1)",
    },
    "CABLE_WIRE": {
        "parent_name": "Cables & Wires",
        "is_hazardous": False,
        "default_hazard": "none",
        "safety_note": "DO NOT BURN! Open cable burning produces carcinogenic dioxins and furans and is strictly penalized under Delhi DPCC guidelines. Strip mechanically.",
        "sub_categories": {
            "copper_wire": {"sub_name": "Insulated Copper Power Cable", "avg_rate": 450.0, "min_rate": 400.0, "max_rate": 500.0},
            "aluminium_wire": {"sub_name": "Aluminium Service Cable", "avg_rate": 140.0, "min_rate": 120.0, "max_rate": 160.0},
            "mixed_wire": {"sub_name": "Mixed Telecom & Power Wiring", "avg_rate": 220.0, "min_rate": 190.0, "max_rate": 250.0},
            "usb_data_cable": {"sub_name": "USB / Ribbon Data Cables", "avg_rate": 160.0, "min_rate": 130.0, "max_rate": 190.0},
        },
        "epr_hint": "Schedule I / Secondary Material",
    },
    "MOTOR_MAGNET": {
        "parent_name": "Motors & Magnet Assemblies",
        "is_hazardous": False,
        "default_hazard": "none",
        "safety_note": "Contains dense copper windings and NdFeB permanent magnets. Keep strong magnets away from credit cards and pace-makers.",
        "sub_categories": {
            "small_appliance_motor": {"sub_name": "Mixer / Fan Electric Motor", "avg_rate": 45.0, "min_rate": 38.0, "max_rate": 52.0},
            "compressor_motor": {"sub_name": "Refrigerator / AC Sealed Compressor", "avg_rate": 65.0, "min_rate": 55.0, "max_rate": 75.0},
            "hdd_speaker_magnet": {"sub_name": "HDD / Acoustic Neodymium Magnets", "avg_rate": 120.0, "min_rate": 90.0, "max_rate": 150.0},
        },
        "epr_hint": "Critical Mineral Recovery Category",
    },
    "METAL_SCRAP": {
        "parent_name": "Metal Casings & Structural Scrap",
        "is_hazardous": False,
        "default_hazard": "none",
        "safety_note": "Beware of sharp sheared sheet metal edges. Wear protective work gloves.",
        "sub_categories": {
            "copper_scrap": {"sub_name": "Solid Copper Busbars & Pipes", "avg_rate": 680.0, "min_rate": 630.0, "max_rate": 730.0},
            "aluminium_scrap": {"sub_name": "Aluminium Heat Sinks & Frames", "avg_rate": 175.0, "min_rate": 155.0, "max_rate": 195.0},
            "iron_steel_scrap": {"sub_name": "Server Rack & Steel Enclosures", "avg_rate": 32.0, "min_rate": 28.0, "max_rate": 36.0},
            "mixed_metal_casing": {"sub_name": "Mixed Alloy Chassis", "avg_rate": 40.0, "min_rate": 35.0, "max_rate": 48.0},
        },
        "epr_hint": "Secondary Ferrous / Non-Ferrous",
    },
    "PLASTIC": {
        "parent_name": "Engineering Plastics",
        "is_hazardous": False,
        "default_hazard": "none",
        "safety_note": "Keep free from oil and heavy dust to maximize pelletizing yield.",
        "sub_categories": {
            "abs_casing": {"sub_name": "ABS Monitor / Printer Casing", "avg_rate": 35.0, "min_rate": 28.0, "max_rate": 42.0},
            "polycarbonate": {"sub_name": "Polycarbonate Clear Optical Scrap", "avg_rate": 42.0, "min_rate": 35.0, "max_rate": 50.0},
            "mixed_plastic": {"sub_name": "Mixed E-Waste Polymer Fragments", "avg_rate": 18.0, "min_rate": 14.0, "max_rate": 22.0},
        },
        "epr_hint": "Plastic Waste Management Rules",
    },
    "WHOLE_DEVICE": {
        "parent_name": "Whole / Semi-Intact Devices",
        "is_hazardous": False,
        "default_hazard": "none",
        "safety_note": "Refurbishable items fetch highest value if kept intact with motherboards undamaged.",
        "sub_categories": {
            "mobile_phone": {"sub_name": "Intact Smartphone / Feature Phone", "avg_rate": 350.0, "min_rate": 280.0, "max_rate": 420.0},
            "laptop": {"sub_name": "Complete Laptop (With Display & Motherboard)", "avg_rate": 280.0, "min_rate": 230.0, "max_rate": 340.0},
            "crt_tv": {"sub_name": "Intact CRT TV Set", "avg_rate": 18.0, "min_rate": 14.0, "max_rate": 24.0},
            "led_tv": {"sub_name": "Intact Flat Screen TV", "avg_rate": 40.0, "min_rate": 32.0, "max_rate": 50.0},
            "small_kitchen_appliance": {"sub_name": "Microwave / Mixer / Iron Box", "avg_rate": 35.0, "min_rate": 28.0, "max_rate": 45.0},
        },
        "epr_hint": "Schedule I (ITEW1 to CEEW5)",
    },
    "LIGHTING": {
        "parent_name": "Lighting & Fluorescent Gear",
        "is_hazardous": True,
        "default_hazard": "mercury",
        "safety_note": "WARNING: Contains toxic mercury vapor. Pack in bubble wrap or cardboard. If broken, ventilate area immediately for 15 minutes before cleanup.",
        "sub_categories": {
            "cfl_bulb": {"sub_name": "Compact Fluorescent Lamp (CFL)", "avg_rate": 10.0, "min_rate": 6.0, "max_rate": 14.0},
            "led_bulb": {"sub_name": "LED Bulb / Driver Assembly", "avg_rate": 20.0, "min_rate": 15.0, "max_rate": 28.0},
            "fluorescent_tube": {"sub_name": "Fluorescent Glass Tube Light", "avg_rate": 8.0, "min_rate": 4.0, "max_rate": 12.0},
        },
        "epr_hint": "Schedule I (CEEW5)",
    },
    "MISC_COMPONENT": {
        "parent_name": "Miscellaneous Electronic Components",
        "is_hazardous": False,
        "default_hazard": "none",
        "safety_note": "Sort gold-plated IC pins separately for maximum metallurgical recovery rate.",
        "sub_categories": {
            "ic_chips_connectors": {"sub_name": "Integrated Circuit Chips & Connectors", "avg_rate": 550.0, "min_rate": 480.0, "max_rate": 650.0},
            "toner_ink_cartridge": {"sub_name": "Printer Toner & Inkjet Cartridges", "avg_rate": 25.0, "min_rate": 18.0, "max_rate": 32.0},
            "other": {"sub_name": "General Mixed E-Waste Components", "avg_rate": 20.0, "min_rate": 15.0, "max_rate": 25.0},
        },
        "epr_hint": "Schedule I Accessories",
    },
}

def get_benchmark_pricing(parent_code: str, sub_code: str) -> Dict[str, float]:
    cat = MATERIAL_TAXONOMY.get(parent_code, {})
    sub = cat.get("sub_categories", {}).get(sub_code)
    if sub:
        return {
            "min_rate": sub["min_rate"],
            "avg_rate": sub["avg_rate"],
            "max_rate": sub["max_rate"],
        }
    return {"min_rate": 20.0, "avg_rate": 35.0, "max_rate": 50.0}
