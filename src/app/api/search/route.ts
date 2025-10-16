import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: false,
        message: 'Query must be at least 2 characters long',
        data: []
      });
    }

    const searchTerm = query.trim().toLowerCase();

    // Mock search results for demonstration
    // In a real application, you would query your database here
    const mockResults = [
      {
        id: '1',
        type: 'product',
        title: 'MacBook Pro 14"',
        name: 'MacBook Pro 14"',
        description: 'High-performance laptop with M3 chip',
        data: { sku: 'MBP14', price: 1999, stock: 15 }
      },
      {
        id: '2',
        type: 'product',
        title: 'iPhone 15 Pro',
        name: 'iPhone 15 Pro',
        description: 'Latest iPhone with advanced camera system',
        data: { sku: 'IP15P', price: 999, stock: 8 }
      },
      {
        id: '3',
        type: 'product',
        title: 'iPad Air',
        name: 'iPad Air',
        description: 'Lightweight tablet perfect for work and creativity',
        data: { sku: 'IPA5', price: 599, stock: 12 }
      },
      {
        id: '10',
        type: 'product',
        title: 'Dell Laptop',
        name: 'Dell Laptop',
        description: 'Business laptop with Intel i7 processor',
        data: { sku: 'DLL17', price: 1299, stock: 5 }
      },
      {
        id: '11',
        type: 'product',
        title: 'Samsung Galaxy S24',
        name: 'Samsung Galaxy S24',
        description: 'Android smartphone with AI features',
        data: { sku: 'SGS24', price: 899, stock: 20 }
      },
      {
        id: '12',
        type: 'product',
        title: 'Wireless Headphones',
        name: 'Wireless Headphones',
        description: 'Noise-cancelling Bluetooth headphones',
        data: { sku: 'WH-BT', price: 199, stock: 30 }
      },
      {
        id: '4',
        type: 'user',
        title: 'John Doe',
        name: 'John Doe',
        description: 'Premium customer with high order value',
        data: { email: 'john@example.com', role: 'CUSTOMER' }
      },
      {
        id: '5',
        type: 'user',
        title: 'Jane Smith',
        name: 'Jane Smith',
        description: 'Administrator with full system access',
        data: { email: 'jane@example.com', role: 'ADMIN' }
      },
      {
        id: '6',
        type: 'user',
        title: 'Mike Johnson',
        name: 'Mike Johnson',
        description: 'Regular customer and newsletter subscriber',
        data: { email: 'mike@example.com', role: 'CUSTOMER' }
      },
      {
        id: '13',
        type: 'user',
        title: 'Sarah Wilson',
        name: 'Sarah Wilson',
        description: 'VIP customer with enterprise account',
        data: { email: 'sarah@example.com', role: 'CUSTOMER' }
      },
      {
        id: '7',
        type: 'order',
        title: 'Order #ORD-001',
        name: 'Order #ORD-001',
        description: 'MacBook Pro and accessories bundle',
        data: { orderNumber: 'ORD-001', total: 2998, status: 'COMPLETED', customer: { name: 'John Doe' } }
      },
      {
        id: '8',
        type: 'order',
        title: 'Order #ORD-002',
        name: 'Order #ORD-002',
        description: 'iPhone 15 Pro with protective case',
        data: { orderNumber: 'ORD-002', total: 1099, status: 'SHIPPED', customer: { name: 'Jane Smith' } }
      },
      {
        id: '9',
        type: 'order',
        title: 'Order #ORD-003',
        name: 'Order #ORD-003',
        description: 'iPad Air for remote work setup',
        data: { orderNumber: 'ORD-003', total: 649, status: 'PROCESSING', customer: { name: 'Mike Johnson' } }
      },
      {
        id: '14',
        type: 'order',
        title: 'Order #ORD-004',
        name: 'Order #ORD-004',
        description: 'Bulk order for office equipment',
        data: { orderNumber: 'ORD-004', total: 5499, status: 'PENDING', customer: { name: 'Sarah Wilson' } }
      }
    ];

    // Filter results based on search term
    const filteredResults = mockResults.filter(result =>
      result.title.toLowerCase().includes(searchTerm) ||
      result.description.toLowerCase().includes(searchTerm) ||
      result.name.toLowerCase().includes(searchTerm)
    );

    // If no exact matches but query is valid, return all results for broader search
    // This provides a better user experience than showing "no results"
    const resultsToReturn = filteredResults.length > 0 ? filteredResults : mockResults;

    return NextResponse.json({
      success: true,
      data: resultsToReturn.slice(0, 10), // Limit to 10 results
      hasExactMatches: filteredResults.length > 0,
      query: searchTerm
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      data: []
    }, { status: 500 });
  }
}
