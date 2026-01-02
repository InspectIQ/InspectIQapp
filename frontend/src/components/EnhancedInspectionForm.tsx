import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Camera, 
  Thermometer,
  Zap,
  Droplets,
  Shield,
  Clock,
  Tool
} from 'lucide-react';

interface InspectionTest {
  id: string;
  name: string;
  description: string;
  test_type: 'visual' | 'measurement' | 'functional' | 'safety' | 'diagnostic';
  category: string;
  instructions: string;
  safety_notes?: string;
  required_tools: string[];
  expected_result?: string;
  acceptable_range?: { min: number; max: number };
  measurement_unit?: string;
  result?: 'pass' | 'fail' | 'warning' | 'not_tested' | 'not_applicable';
  measured_value?: number;
  notes?: string;
  photos: string[];
  timestamp?: string;
}

interface InspectionChecklist {
  id: string;
  name: string;
  description: string;
  categories: { [key: string]: InspectionTest[] };
  estimated_time: number;
  required_certifications: string[];
}

const EnhancedInspectionForm: React.FC<{ propertyId: number }> = ({ propertyId }) => {
  const [activeChecklist, setActiveChecklist] = useState<string>('hvac');
  const [checklists, setChecklists] = useState<{ [key: string]: InspectionChecklist }>({});
  const [testResults, setTestResults] = useState<{ [key: string]: InspectionTest }>({});
  const [currentTest, setCurrentTest] = useState<InspectionTest | null>(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  // Mock data - in real app, fetch from API
  useEffect(() => {
    const mockChecklists = {
      hvac: {
        id: 'hvac_comprehensive',
        name: 'HVAC System Inspection',
        description: 'Complete heating, ventilation, and air conditioning evaluation',
        estimated_time: 45,
        required_certifications: [],
        categories: {
          'Heating System': [
            {
              id: 'heat_functionality',
              name: 'Heating System Functionality',
              description: 'Test heating system operation and temperature rise',
              test_type: 'functional' as const,
              category: 'HVAC',
              instructions: '1. Set thermostat 10°F above current temp\n2. Wait 10 minutes\n3. Measure temperature at supply vents\n4. Check for even heating across zones',
              safety_notes: 'Ensure proper ventilation. Check for gas leaks before testing.',
              required_tools: ['digital thermometer', 'infrared thermometer'],
              expected_result: 'Temperature rise of 15-25°F at vents',
              acceptable_range: { min: 15.0, max: 25.0 },
              measurement_unit: 'fahrenheit',
              photos: []
            },
            {
              id: 'air_flow_measurement',
              name: 'Air Flow Measurement',
              description: 'Measure air velocity at supply and return vents',
              test_type: 'measurement' as const,
              category: 'HVAC',
              instructions: 'Use anemometer to measure air velocity at each vent',
              required_tools: ['anemometer'],
              expected_result: 'Supply vents: 300-750 CFM, Return vents: 200-500 CFM',
              measurement_unit: 'cfm',
              photos: []
            }
          ],
          'Ventilation': [
            {
              id: 'exhaust_fan_performance',
              name: 'Exhaust Fan Performance',
              description: 'Test bathroom and kitchen exhaust fans',
              test_type: 'measurement' as const,
              category: 'HVAC',
              instructions: '1. Turn on exhaust fan\n2. Hold tissue paper near fan\n3. Measure air flow if possible\n4. Check for proper exterior venting',
              required_tools: ['tissue paper', 'anemometer (optional)'],
              expected_result: 'Strong suction, proper exterior discharge',
              photos: []
            }
          ]
        }
      },
      electrical: {
        id: 'electrical_comprehensive',
        name: 'Electrical System Safety Inspection',
        description: 'Comprehensive electrical safety and functionality testing',
        estimated_time: 60,
        required_certifications: ['electrical_safety'],
        categories: {
          'Main Panel': [
            {
              id: 'panel_voltage_test',
              name: 'Main Panel Voltage Test',
              description: 'Verify proper voltage at main panel',
              test_type: 'measurement' as const,
              category: 'Electrical',
              instructions: '1. Use multimeter to test voltage\n2. Check 120V and 240V circuits\n3. Verify proper grounding',
              safety_notes: 'DANGER: Only qualified electricians should open panel. Use proper PPE.',
              required_tools: ['multimeter', 'non-contact voltage tester'],
              expected_result: '120V ±5% for standard circuits, 240V ±5% for high-voltage',
              acceptable_range: { min: 114.0, max: 126.0 },
              measurement_unit: 'volts',
              photos: []
            }
          ],
          'Outlets and Switches': [
            {
              id: 'gfci_outlet_test',
              name: 'GFCI Outlet Testing',
              description: 'Test all GFCI outlets for proper operation',
              test_type: 'functional' as const,
              category: 'Electrical',
              instructions: '1. Press TEST button - outlet should turn off\n2. Press RESET button - outlet should turn on\n3. Use outlet tester for wiring verification',
              required_tools: ['outlet tester', 'GFCI tester'],
              expected_result: 'All GFCI outlets test and reset properly',
              photos: []
            }
          ]
        }
      },
      plumbing: {
        id: 'plumbing_comprehensive',
        name: 'Plumbing System Performance',
        description: 'Water pressure, flow, and system integrity testing',
        estimated_time: 40,
        required_certifications: [],
        categories: {
          'Water Pressure': [
            {
              id: 'static_water_pressure',
              name: 'Static Water Pressure Test',
              description: 'Measure water pressure at multiple fixtures',
              test_type: 'measurement' as const,
              category: 'Plumbing',
              instructions: '1. Attach pressure gauge to hose bib\n2. Turn off all water fixtures\n3. Read static pressure\n4. Test at multiple locations',
              required_tools: ['water pressure gauge'],
              expected_result: '40-80 PSI (optimal 50-60 PSI)',
              acceptable_range: { min: 40.0, max: 80.0 },
              measurement_unit: 'psi',
              photos: []
            }
          ]
        }
      }
    };
    setChecklists(mockChecklists);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'hvac':
      case 'heating system':
      case 'ventilation':
        return <Thermometer className="h-5 w-5" />;
      case 'electrical':
      case 'main panel':
      case 'outlets and switches':
        return <Zap className="h-5 w-5" />;
      case 'plumbing':
      case 'water pressure':
      case 'drainage':
        return <Droplets className="h-5 w-5" />;
      case 'safety':
        return <Shield className="h-5 w-5" />;
      default:
        return <Tool className="h-5 w-5" />;
    }
  };

  const getResultIcon = (result?: string) => {
    switch (result) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const openTestModal = (test: InspectionTest) => {
    setCurrentTest(test);
    setIsTestModalOpen(true);
  };

  const saveTestResult = (testId: string, result: Partial<InspectionTest>) => {
    setTestResults(prev => ({
      ...prev,
      [testId]: { ...prev[testId], ...result }
    }));
    setIsTestModalOpen(false);
  };

  const TestModal: React.FC = () => {
    if (!currentTest) return null;

    const [result, setResult] = useState<string>(testResults[currentTest.id]?.result || 'not_tested');
    const [measuredValue, setMeasuredValue] = useState<string>(
      testResults[currentTest.id]?.measured_value?.toString() || ''
    );
    const [notes, setNotes] = useState<string>(testResults[currentTest.id]?.notes || '');

    const handleSave = () => {
      saveTestResult(currentTest.id, {
        result: result as any,
        measured_value: measuredValue ? parseFloat(measuredValue) : undefined,
        notes,
        timestamp: new Date().toISOString()
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center gap-3 mb-4">
            {getCategoryIcon(currentTest.category)}
            <h2 className="text-xl font-semibold">{currentTest.name}</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-gray-600">{currentTest.description}</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Instructions</h3>
              <div className="bg-blue-50 p-3 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">{currentTest.instructions}</pre>
              </div>
            </div>

            {currentTest.safety_notes && (
              <div>
                <h3 className="font-medium mb-2 text-red-600">⚠️ Safety Notes</h3>
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <p className="text-red-800 text-sm">{currentTest.safety_notes}</p>
                </div>
              </div>
            )}

            {currentTest.required_tools.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Required Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {currentTest.required_tools.map((tool, index) => (
                    <Badge key={index} variant="outline">{tool}</Badge>
                  ))}
                </div>
              </div>
            )}

            {currentTest.expected_result && (
              <div>
                <h3 className="font-medium mb-2">Expected Result</h3>
                <p className="text-gray-600 bg-gray-50 p-2 rounded">{currentTest.expected_result}</p>
              </div>
            )}

            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Test Results</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Result</label>
                  <select 
                    value={result} 
                    onChange={(e) => setResult(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="not_tested">Not Tested</option>
                    <option value="pass">Pass</option>
                    <option value="fail">Fail</option>
                    <option value="warning">Warning</option>
                    <option value="not_applicable">Not Applicable</option>
                  </select>
                </div>

                {currentTest.measurement_unit && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Measured Value ({currentTest.measurement_unit})
                    </label>
                    <Input
                      type="number"
                      value={measuredValue}
                      onChange={(e) => setMeasuredValue(e.target.value)}
                      placeholder="Enter measurement"
                    />
                    {currentTest.acceptable_range && (
                      <p className="text-xs text-gray-500 mt-1">
                        Acceptable range: {currentTest.acceptable_range.min} - {currentTest.acceptable_range.max}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional observations, issues found, or recommendations..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={handleSave} className="flex-1">
              Save Results
            </Button>
            <Button variant="outline" onClick={() => setIsTestModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Enhanced Property Inspection</h2>
        <Badge variant="outline" className="text-sm">
          Professional Testing & Measurements
        </Badge>
      </div>

      <Tabs value={activeChecklist} onValueChange={setActiveChecklist}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hvac" className="flex items-center gap-2">
            <Thermometer className="h-4 w-4" />
            HVAC
          </TabsTrigger>
          <TabsTrigger value="electrical" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Electrical
          </TabsTrigger>
          <TabsTrigger value="plumbing" className="flex items-center gap-2">
            <Droplets className="h-4 w-4" />
            Plumbing
          </TabsTrigger>
        </TabsList>

        {Object.entries(checklists).map(([checklistId, checklist]) => (
          <TabsContent key={checklistId} value={checklistId}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getCategoryIcon(checklistId)}
                      {checklist.name}
                    </CardTitle>
                    <p className="text-gray-600 mt-1">{checklist.description}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {checklist.estimated_time} min
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(checklist.categories).map(([categoryName, tests]) => (
                    <div key={categoryName}>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        {getCategoryIcon(categoryName)}
                        {categoryName}
                      </h3>
                      <div className="grid gap-3">
                        {tests.map((test) => (
                          <Card key={test.id} className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardContent className="p-4" onClick={() => openTestModal(test)}>
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3">
                                    {getResultIcon(testResults[test.id]?.result)}
                                    <div>
                                      <h4 className="font-medium">{test.name}</h4>
                                      <p className="text-sm text-gray-600">{test.description}</p>
                                      {test.required_tools.length > 0 && (
                                        <div className="flex gap-1 mt-1">
                                          {test.required_tools.slice(0, 2).map((tool, index) => (
                                            <Badge key={index} variant="secondary" className="text-xs">
                                              {tool}
                                            </Badge>
                                          ))}
                                          {test.required_tools.length > 2 && (
                                            <Badge variant="secondary" className="text-xs">
                                              +{test.required_tools.length - 2} more
                                            </Badge>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  {testResults[test.id]?.measured_value && (
                                    <div className="text-sm font-medium">
                                      {testResults[test.id].measured_value} {test.measurement_unit}
                                    </div>
                                  )}
                                  <Badge 
                                    variant={
                                      testResults[test.id]?.result === 'pass' ? 'default' :
                                      testResults[test.id]?.result === 'fail' ? 'destructive' :
                                      testResults[test.id]?.result === 'warning' ? 'secondary' :
                                      'outline'
                                    }
                                    className="text-xs"
                                  >
                                    {testResults[test.id]?.result || 'Not Tested'}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {isTestModalOpen && <TestModal />}
    </div>
  );
};

export default EnhancedInspectionForm;