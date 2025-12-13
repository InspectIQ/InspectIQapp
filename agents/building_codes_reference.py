"""
Building Codes Reference for InspectIQ AI Agents

This module contains common building code violations and state-specific guidance
to enhance AI agent analysis with code compliance awareness.
"""

from typing import Dict, List, Optional


class BuildingCodesReference:
    """Reference for common building code violations and state-specific requirements."""
    
    # Common code violations by category
    COMMON_VIOLATIONS = {
        "electrical": [
            "Exposed wiring or junction boxes",
            "Missing GFCI outlets in bathrooms/kitchens",
            "Overloaded electrical panels or circuits", 
            "Improper grounding or bonding",
            "Damaged electrical panels or covers",
            "Extension cords used as permanent wiring",
            "Outlets too close to water sources",
            "Missing electrical permits for modifications"
        ],
        "plumbing": [
            "Visible leaks or water damage",
            "Improper drainage or standing water",
            "Missing shut-off valves",
            "Cross-connections between potable and non-potable water",
            "Non-compliant fixture installations",
            "Inadequate water pressure",
            "Missing or damaged pipe insulation",
            "Improper venting of plumbing fixtures"
        ],
        "safety": [
            "Missing or non-functional smoke detectors",
            "Missing carbon monoxide detectors",
            "Blocked emergency exits or egress windows",
            "Unsafe stair railings or missing handrails",
            "Broken or missing safety glass",
            "Inadequate lighting in stairways",
            "Missing safety devices (GFCI, AFCI)",
            "Unsafe storage of hazardous materials"
        ],
        "structural": [
            "Cracks in load-bearing walls or foundations",
            "Sagging floors, ceilings, or rooflines",
            "Damaged or missing support beams",
            "Foundation settlement or movement",
            "Structural modifications without permits",
            "Inadequate structural support for additions",
            "Water damage affecting structural integrity",
            "Missing or damaged structural connections"
        ],
        "fire_safety": [
            "Blocked fire exits or escape routes",
            "Missing fire extinguishers or smoke detectors",
            "Improper storage near heat sources",
            "Damaged fire-rated walls or doors",
            "Missing fire stops in wall penetrations",
            "Inadequate clearance around heating equipment",
            "Combustible materials in unsafe locations",
            "Missing or damaged fire suppression systems"
        ],
        "ventilation": [
            "Blocked or missing exhaust fans in bathrooms",
            "Inadequate ventilation in kitchens",
            "Blocked HVAC vents or returns",
            "Missing ventilation in attics or crawl spaces",
            "Improper dryer vent installations",
            "Inadequate fresh air intake",
            "Moisture problems due to poor ventilation",
            "Missing range hoods over cooking surfaces"
        ]
    }
    
    # State-specific building code highlights
    STATE_CODES = {
        "AL": "Alabama requires smoke detectors in bedrooms. GFCI outlets in wet locations. Hurricane preparedness in coastal areas.",
        "AK": "Alaska has extreme weather building requirements. Proper insulation critical. Heating system safety paramount.",
        "AZ": "Arizona requires energy-efficient construction. Proper ventilation for desert climate. Electrical safety in high-heat conditions.",
        "AR": "Arkansas requires smoke detectors on every level. GFCI protection in wet areas. Tornado-resistant construction considerations.",
        "CA": "California requires GFCI outlets in all bathrooms, kitchens, and outdoor areas. Seismic safety standards apply. Energy efficiency codes are strict. Professional permits required for most work.",
        "CO": "Colorado has high-altitude building considerations. Proper ventilation critical. Snow load requirements for roofing.",
        "CT": "Connecticut requires smoke and CO detectors. GFCI protection mandatory. Energy efficiency standards enforced.",
        "DE": "Delaware requires smoke detectors in bedrooms. GFCI outlets in wet locations. Coastal building considerations.",
        "FL": "Florida has strict hurricane codes - impact-resistant windows, reinforced roofing. GFCI outlets required in bathrooms, kitchens, garages. Mold prevention is critical due to humidity.",
        "GA": "Georgia requires smoke detectors in bedrooms and hallways. GFCI protection in wet areas. Termite inspection considerations.",
        "HI": "Hawaii has tropical climate building requirements. Hurricane/typhoon resistance. Proper ventilation for humidity control.",
        "ID": "Idaho requires smoke detectors on every level. GFCI outlets in wet locations. Seismic considerations in some areas.",
        "IL": "Illinois requires smoke detectors on every level and in bedrooms. GFCI outlets in bathrooms and kitchens. Carbon monoxide detectors required near sleeping areas.",
        "IN": "Indiana requires smoke detectors in bedrooms. GFCI protection in wet areas. Tornado-resistant construction considerations.",
        "IA": "Iowa requires smoke detectors on every level. GFCI outlets in wet locations. Severe weather building considerations.",
        "KS": "Kansas requires smoke detectors in bedrooms. GFCI protection mandatory. Tornado-resistant construction important.",
        "KY": "Kentucky requires smoke detectors on every level. GFCI outlets in wet areas. Radon testing considerations.",
        "LA": "Louisiana has hurricane building codes. GFCI protection required. Flood-resistant construction in flood zones.",
        "ME": "Maine requires smoke and CO detectors. GFCI protection in wet areas. Cold weather building considerations.",
        "MD": "Maryland requires smoke detectors in bedrooms. GFCI outlets mandatory. Radon testing may be required.",
        "MA": "Massachusetts requires smoke and CO detectors. GFCI protection mandatory. Energy efficiency codes enforced.",
        "MI": "Michigan requires smoke detectors on every level. GFCI protection in bathrooms, kitchens, and basements. Carbon monoxide detectors required.",
        "MN": "Minnesota requires smoke detectors on every level. GFCI outlets in wet locations. Cold weather building standards.",
        "MS": "Mississippi requires smoke detectors in bedrooms. GFCI protection in wet areas. Hurricane preparedness in coastal areas.",
        "MO": "Missouri requires smoke detectors on every level. GFCI outlets in wet locations. Tornado-resistant construction considerations.",
        "MT": "Montana requires smoke detectors on every level. GFCI protection mandatory. Cold weather and seismic considerations.",
        "NE": "Nebraska requires smoke detectors in bedrooms. GFCI outlets in wet areas. Severe weather building considerations.",
        "NV": "Nevada requires smoke detectors on every level. GFCI protection mandatory. Desert climate building considerations.",
        "NH": "New Hampshire requires smoke and CO detectors. GFCI protection in wet areas. Cold weather building standards.",
        "NJ": "New Jersey requires smoke detectors in bedrooms. GFCI outlets mandatory. Radon testing considerations.",
        "NM": "New Mexico requires smoke detectors on every level. GFCI protection in wet areas. Desert climate considerations.",
        "NY": "New York requires smoke and carbon monoxide detectors. GFCI protection in bathrooms, kitchens, basements. Lead paint disclosure required for pre-1978 buildings.",
        "NC": "North Carolina requires smoke detectors in all bedrooms. GFCI outlets in bathrooms and kitchens. Hurricane preparedness in coastal areas.",
        "ND": "North Dakota requires smoke detectors on every level. GFCI protection mandatory. Extreme cold weather building standards.",
        "OH": "Ohio requires smoke detectors on every level and in bedrooms. GFCI outlets in bathrooms, kitchens, and basements.",
        "OK": "Oklahoma requires smoke detectors in bedrooms. GFCI protection in wet areas. Tornado-resistant construction critical.",
        "OR": "Oregon requires smoke detectors on every level. GFCI protection mandatory. Seismic building codes enforced.",
        "PA": "Pennsylvania requires smoke detectors in bedrooms and hallways. GFCI protection in wet locations. Radon testing may be required.",
        "RI": "Rhode Island requires smoke and CO detectors. GFCI protection mandatory. Coastal building considerations.",
        "SC": "South Carolina requires smoke detectors in bedrooms. GFCI outlets in wet areas. Hurricane preparedness in coastal areas.",
        "SD": "South Dakota requires smoke detectors on every level. GFCI protection in wet areas. Severe weather considerations.",
        "TN": "Tennessee requires smoke detectors in bedrooms. GFCI protection mandatory. Tornado-resistant construction considerations.",
        "TX": "Texas requires smoke detectors in all bedrooms and hallways. GFCI protection required in bathrooms and kitchens. Hurricane-resistant features may be required in coastal areas.",
        "UT": "Utah requires smoke detectors on every level. GFCI outlets in wet locations. Seismic building considerations.",
        "VT": "Vermont requires smoke and CO detectors. GFCI protection mandatory. Cold weather building standards.",
        "VA": "Virginia requires smoke detectors in bedrooms. GFCI outlets in wet areas. Hurricane preparedness in coastal areas.",
        "WA": "Washington requires smoke detectors on every level. GFCI protection mandatory. Seismic building codes enforced.",
        "WV": "West Virginia requires smoke detectors in bedrooms. GFCI protection in wet areas. Radon testing considerations.",
        "WI": "Wisconsin requires smoke detectors on every level. GFCI outlets in wet locations. Cold weather building standards.",
        "WY": "Wyoming requires smoke detectors on every level. GFCI protection mandatory. Cold weather and wind-resistant construction."
    }
    
    @classmethod
    def get_state_guidance(cls, state_code: str) -> str:
        """Get state-specific building code guidance."""
        return cls.STATE_CODES.get(state_code.upper(), "")
    
    @classmethod
    def get_violations_by_category(cls, category: str) -> List[str]:
        """Get common violations for a specific category."""
        return cls.COMMON_VIOLATIONS.get(category.lower(), [])
    
    @classmethod
    def get_all_categories(cls) -> List[str]:
        """Get all available violation categories."""
        return list(cls.COMMON_VIOLATIONS.keys())
    
    @classmethod
    def is_critical_violation(cls, issue_type: str, code_category: str) -> bool:
        """Determine if a code violation is critical/urgent."""
        critical_types = [
            "electrical_violation",
            "safety_violation", 
            "fire_safety_violation",
            "structural_violation"
        ]
        critical_categories = [
            "electrical",
            "safety",
            "fire_safety", 
            "structural"
        ]
        
        return (issue_type in critical_types or 
                code_category in critical_categories)
    
    @classmethod
    def get_compliance_disclaimer(cls) -> str:
        """Get standard building code compliance disclaimer."""
        return """
**IMPORTANT BUILDING CODE DISCLAIMER:**
This analysis provides general building code guidance only. Building codes vary significantly by local jurisdiction (city, county, state). This assessment is not a substitute for professional inspection or official code compliance verification. Always consult local building authorities and licensed professionals for official compliance determinations. This report does not constitute legal advice or official inspection results.
"""

    @classmethod
    def get_professional_recommendations(cls, code_categories: List[str]) -> List[str]:
        """Get professional consultation recommendations based on code categories found."""
        recommendations = []
        
        category_professionals = {
            "electrical": "Licensed electrician for electrical code compliance verification",
            "plumbing": "Licensed plumber for plumbing code compliance assessment", 
            "safety": "Certified home inspector for comprehensive safety evaluation",
            "structural": "Structural engineer for load-bearing and foundation assessment",
            "fire_safety": "Fire safety inspector for fire code compliance review",
            "ventilation": "HVAC professional for ventilation system evaluation"
        }
        
        for category in set(code_categories):
            if category in category_professionals:
                recommendations.append(category_professionals[category])
        
        # Always recommend general inspection if any code issues found
        if code_categories:
            recommendations.append("Local building inspector for official code compliance verification")
            recommendations.append("Obtain proper permits before making any corrections")
        
        return recommendations